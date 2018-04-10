define([
	'fontoxml-families/configureAsFrame',
	'fontoxml-families/configureAsSheetFrame',
	'fontoxml-families/configureAsStructure',
	'fontoxml-families/configureAsTitleFrame',
	'fontoxml-families/configureContextualOperations',
	'fontoxml-families/createMarkupLabelWidget',
	'fontoxml-families/createRelatedNodesQueryWidget',
	'fontoxml-localization/t'
], function (
	configureAsFrame,
	configureAsSheetFrame,
	configureAsStructure,
	configureAsTitleFrame,
	configureContextualOperations,
	createMarkupLabelWidget,
	createRelatedNodesQueryWidget,
	t
) {
	'use strict';

	return function configureSxModule (sxModule) {
		// learningSummary
		//     A Learning Summary recaps and provides context for the achievement or accomplishment of learning
		//     objectives, provides guidance to reinforce learning and long-term memory, and may pose questions to
		//     enhance encoding and verification of the learning content.
		configureAsSheetFrame(sxModule, 'self::learningSummary', t('learning summary'), {
			defaultTextContainer: 'learningSummarybody',
			titleQuery: './title//text()[not(ancestor::*[name() = ("sort-at", "draft-comment", "foreign", "unknown", "required-cleanup", "image")])]/string() => string-join()',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links'),
				createRelatedNodesQueryWidget('descendant::fn[not(@conref) and fonto:in-inline-layout(.)]')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// learningSummary nested in topic
		configureAsFrame(sxModule, 'self::learningSummary and ancestor::*[fonto:dita-class(., "topic/topic")]', undefined, {
			defaultTextContainer: 'learningSummarybody',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// title in learningSummary
		configureAsTitleFrame(sxModule, 'self::title[parent::learningSummary]', undefined, {
			fontVariation: 'document-title'
		});

		// learningSummarybody
		//     The <learningSummarybody> element is the main body-level element in a learningSummary topic.
		configureAsStructure(sxModule, 'self::learningSummarybody', t('body'), {
			defaultTextContainer: 'section',
			ignoredForNavigationNextToSelector: 'false()',
			isRemovableIfEmpty: false
		});

		// section in learningSummarybody
		configureContextualOperations(sxModule, 'self::section[parent::learningSummarybody]', [
			{ name: ':section-insert-title' },
			{ name: ':contextual-delete-section' }
		]);
	};
});
