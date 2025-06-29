'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
} from 'lexical';

import {
  $createHeadingNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text';

import { FORMAT_TEXT_COMMAND } from 'lexical';

// Configuration stable de l'éditeur (en dehors du composant)
const editorConfig = {
  namespace: 'ArticleEditor',
  theme: {
    paragraph: 'text-gray-900 dark:text-gray-100 leading-relaxed mb-2',
    heading: {
      h1: 'text-3xl font-bold my-4 text-gray-900 dark:text-gray-100',
      h2: 'text-2xl font-semibold my-3 text-gray-900 dark:text-gray-100',
    },
    text: {
      bold: 'font-bold',
      italic: 'italic',
    },
  },
  onError(error) {
    throw error;
  },
  nodes: [HeadingNode, QuoteNode],
};

// Composant Toolbar simple sans mémorisation pour éviter les problèmes
function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(tag);
        const selectedText = selection.getTextContent();
        if (selectedText) {
          heading.append($createTextNode(selectedText));
          selection.insertNodes([heading]);
        } else {
          selection.insertNodes([heading]);
        }
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
      <button 
        type="button"
        onClick={() => formatText('bold')} 
        className="px-4 py-2 bg-white/90 dark:bg-gray-700/90 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <strong>B</strong> Gras
      </button>
      <button 
        type="button"
        onClick={() => formatText('italic')} 
        className="px-4 py-2 bg-white/90 dark:bg-gray-700/90 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <em>I</em> Italique
      </button>
      <button 
        type="button"
        onClick={() => insertHeading('h1')} 
        className="px-4 py-2 bg-white/90 dark:bg-gray-700/90 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        H1 Titre 1
      </button>
      <button 
        type="button"
        onClick={() => insertHeading('h2')} 
        className="px-4 py-2 bg-white/90 dark:bg-gray-700/90 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        H2 Titre 2
      </button>
    </div>
  );
}

const NewArticle = ({ onSuccess, onError, showPreview = true, className = "" }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  const contentRef = useRef('');
  const structuredContentRef = useRef(null);

  // Fonctions de conversion mémorisées pour éviter les re-créations
  const convertStructureToMarkdown = useCallback((jsonState) => {
    if (!jsonState) return '';
    
    try {
      if (!jsonState.root || !jsonState.root.children) {
        return contentRef.current;
      }
      
      let markdown = '';
      jsonState.root.children.forEach((node) => {
        markdown += convertJsonNodeToMarkdown(node) + '\n\n';
      });
      
      return markdown.trim();
    } catch (error) {
      console.warn('Erreur lors de la conversion en Markdown:', error);
      return contentRef.current;
    }
  }, []);

  // Fonction pour convertir un nœud JSON en Markdown
  const convertJsonNodeToMarkdown = (node) => {
    switch (node.type) {
      case 'heading':
        const level = '#'.repeat(node.tag === 'h1' ? 1 : node.tag === 'h2' ? 2 : 3);
        const headingText = extractTextFromChildren(node.children);
        return `${level} ${headingText}`;
      
      case 'paragraph':
        return extractTextFromChildren(node.children);
      
      default:
        return extractTextFromChildren(node.children || []);
    }
  };

  // Fonction pour extraire le texte formaté des enfants
  const extractTextFromChildren = (children) => {
    if (!children) return '';
    
    return children.map((child) => {
      if (child.type === 'text') {
        let text = child.text || '';
        
        // Appliquer le formatage selon le champ format
        if (child.format === 1) { // Bold
          text = `**${text}**`;
        } else if (child.format === 2) { // Italic
          text = `*${text}*`;
        } else if (child.format === 3) { // Bold + Italic
          text = `***${text}***`;
        }
        
        return text;
      }
      return '';
    }).join('');
  };

  // Callback mémorisé pour le changement de l'éditeur
  const onChange = useCallback((editorState) => {
    editorState.read(() => {
      // Récupère le texte brut
      const text = $getRoot().getTextContent();
      contentRef.current = text;
      setContent(text);
      
      // Stocke la structure JSON directement
      const jsonState = editorState.toJSON();
      structuredContentRef.current = jsonState;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setFeedback({
        type: 'error',
        message: 'Le titre et le contenu sont requis.'
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      // Convertir le contenu en Markdown
      const markdownContent = convertStructureToMarkdown(structuredContentRef.current);
      
      // Préparer les données à envoyer
      const articleData = {
        title: title.trim(),
        content: markdownContent || contentRef.current,
        author: '67ab097e33fd4f7db789f3f6', // TODO: Récupérer l'ID utilisateur authentifié
        category: category.trim() || 'Non catégorisé',
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (response.ok) {
        setFeedback({
          type: 'success',
          message: 'Article créé avec succès !'
        });
        
        // Réinitialiser le formulaire
        resetForm();
        
        // Callback de succès
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        throw new Error(result.error || 'Erreur lors de la création de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setFeedback({
        type: 'error',
        message: error.message || 'Une erreur s\'est produite lors de la création de l\'article.'
      });
      
      // Callback d'erreur
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setCategory('');
    setTags('');
    setCoverImage('');
    contentRef.current = '';
    structuredContentRef.current = null;
    setFeedback({ type: '', message: '' });
  }, []);

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Feedback Message */}
      {feedback.message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          feedback.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {feedback.message}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre de l'article *
            </label>
            <input
              type="text"
              placeholder="Entrez le titre de votre article..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Metadata Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <input
                  type="text"
                  placeholder="ex: Technologie, Sport..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="ex: javascript, react, web"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Editor Section */}
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Contenu de l'article *
            </label>
            
            <LexicalComposer initialConfig={editorConfig}>
              <Toolbar />
              <div className="border border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-700/90 min-h-[300px] focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all duration-200 shadow-sm">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="outline-none min-h-[280px] p-4 text-gray-900 dark:text-gray-100" />
                  }
                  placeholder={
                    <div className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                      Commencez à écrire votre article ici...
                    </div>
                  }
                  ErrorBoundary={({ children }) => <>{children}</>}
                />
                <HistoryPlugin />
                <OnChangePlugin onChange={onChange} />
              </div>
            </LexicalComposer>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {title.length > 0 && `Titre: ${title.length} caractères`}
              {content.length > 0 && (
                <span className="ml-4">
                  Contenu: {content.length} caractères
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publication...
                  </div>
                ) : (
                  'Publier l\'article'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && (title.trim() || content.trim()) && (
        <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full mr-3"></div>
            Aperçu de l'article
          </h3>
          {title.trim() && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
          )}
          {category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-100 to-orange-100 dark:from-cyan-900/30 dark:to-orange-900/30 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          )}
          {tags && (
            <div className="mb-4">
              {tags.split(',').map((tag, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium mr-2 mb-2">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
          {content.trim() && (
            <div className="text-gray-700 dark:text-gray-300 prose prose-gray dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewArticle;
