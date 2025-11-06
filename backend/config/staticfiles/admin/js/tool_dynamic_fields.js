/**
 * Django Admin Custom JavaScript for AI Tool Admin
 * Handles dynamic visibility of inline forms and type-based field visibility
 * File: backend/static/admin/js/tool_dynamic_fields.js
 */

(function() {
    'use strict';

    // Tool type choices
    const TOOL_TYPES = {
        'text-to-text': 'Text to Text',
        'text-to-image': 'Text to Image',
        'text-to-video': 'Text to Video',
        'text-to-audio': 'Text to Audio',
        'image-to-image': 'Image to Image',
        'other': 'Other'
    };

    // Types that support examples/demonstrations
    const DEMO_SUPPORTING_TYPES = [
        'text-to-text',
        'text-to-image',
        'text-to-video',
        'text-to-audio',
        'image-to-image'
    ];

    /**
     * Initialize dynamic field visibility on page load
     */
    function initDynamicFields() {
        const typeSelect = document.querySelector('#id_type');
        
        if (!typeSelect) return;

        // Run initial setup
        handleTypeChange();

        // Add event listener for type changes
        typeSelect.addEventListener('change', handleTypeChange);

        // Enhance inline sections with better styling
        styleInlineSections();
    }

    /**
     * Handle tool type change and show/hide relevant sections
     */
    function handleTypeChange() {
        const typeSelect = document.querySelector('#id_type');
        if (!typeSelect) return;

        const selectedType = typeSelect.value;

        // Show/hide examples section based on type
        const exampleSection = findInlineSection('toolexample');
        if (exampleSection) {
            const shouldShow = DEMO_SUPPORTING_TYPES.includes(selectedType);
            exampleSection.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                updateExampleFieldsForType(selectedType);
                exampleSection.classList.add('active-section');
            } else {
                exampleSection.classList.remove('active-section');
            }
        }

        // Add visual feedback
        addTypeChangeIndicator(typeSelect, selectedType);
    }

    /**
     * Find inline section by model name
     */
    function findInlineSection(modelName) {
        // Look for fieldset with data attribute or class containing model name
        const fieldsets = document.querySelectorAll('fieldset.inline-group');
        
        for (let fieldset of fieldsets) {
            if (fieldset.className.includes(modelName) || 
                fieldset.textContent.toLowerCase().includes(modelName)) {
                return fieldset;
            }
        }

        // Fallback: search by h2 text content
        const inlineGroups = document.querySelectorAll('.inline-group');
        for (let group of inlineGroups) {
            const h2 = group.querySelector('h2');
            if (h2 && h2.textContent.toLowerCase().includes(modelName)) {
                return group;
            }
        }

        return null;
    }

    /**
     * Update example field labels and help text based on tool type
     */
    function updateExampleFieldsForType(type) {
        const rows = document.querySelectorAll('.inline-related[id*="toolexample"] .form-row');
        
        rows.forEach(row => {
            const promptField = row.querySelector('[id*="prompt"]');
            const resultTextField = row.querySelector('[id*="result_text"]');
            const resultImageField = row.querySelector('[id*="result_image"]');

            if (promptField) {
                const label = promptField.parentElement.querySelector('label');
                if (label) {
                    label.textContent = getPromptLabel(type);
                }
            }

            if (resultTextField) {
                const label = resultTextField.parentElement.querySelector('label');
                if (label) {
                    label.textContent = getResultLabel(type, 'text');
                }
                // Show/hide based on type
                resultTextField.closest('.form-row').style.display = 
                    (type === 'text-to-text' || type === 'text-to-audio') ? 'block' : 'none';
            }

            if (resultImageField) {
                const label = resultImageField.parentElement.querySelector('label');
                if (label) {
                    label.textContent = getResultLabel(type, 'image');
                }
                // Show/hide based on type
                resultImageField.closest('.form-row').style.display = 
                    (type === 'text-to-image' || type === 'image-to-image') ? 'block' : 'none';
            }
        });
    }

    /**
     * Get appropriate label for prompt field based on type
     */
    function getPromptLabel(type) {
        const labels = {
            'text-to-text': 'Prompt (Text)',
            'text-to-image': 'Prompt (Text Input)',
            'text-to-video': 'Prompt (Video Description)',
            'text-to-audio': 'Prompt (Audio Description)',
            'image-to-image': 'Input Image Description',
            'other': 'Input Prompt'
        };
        return labels[type] || 'Prompt';
    }

    /**
     * Get appropriate label for result field based on type
     */
    function getResultLabel(type, fieldType) {
        const labels = {
            'text-to-text': { text: 'Output (Text)', image: 'Output (Visual)' },
            'text-to-image': { text: 'Output Description', image: 'Generated Image' },
            'text-to-video': { text: 'Video Description', image: 'Video Thumbnail' },
            'text-to-audio': { text: 'Audio Transcript', image: 'Waveform/Preview' },
            'image-to-image': { text: 'Processing Notes', image: 'Output Image' },
            'other': { text: 'Output (Text)', image: 'Output (Image)' }
        };
        return labels[type]?.[fieldType] || `Result (${fieldType})`;
    }

    /**
     * Add visual feedback indicator showing current tool type
     */
    function addTypeChangeIndicator(selectElement, type) {
        let indicator = document.querySelector('.type-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'type-indicator';
            selectElement.parentElement.insertBefore(indicator, selectElement.nextSibling);
        }

        const typeName = TOOL_TYPES[type] || type;
        indicator.innerHTML = `<span class="badge badge-${type}">Type: ${typeName}</span>`;
        indicator.style.marginTop = '8px';
        indicator.style.marginBottom = '8px';
    }

    /**
     * Apply styling to inline sections
     */
    function styleInlineSections() {
        const inlineGroups = document.querySelectorAll('.inline-group');
        
        inlineGroups.forEach(group => {
            const h2 = group.querySelector('h2');
            if (h2) {
                h2.style.borderBottom = '2px solid #417690';
                h2.style.paddingBottom = '10px';
                h2.style.marginBottom = '15px';
            }

            // Add some spacing to inline form rows
            const formRows = group.querySelectorAll('.form-row');
            formRows.forEach(row => {
                row.style.marginBottom = '10px';
            });
        });
    }

    /**
     * Watch for dynamically added inline forms (when user clicks "Add another")
     */
    function setupInlineObserver() {
        // Monitor for newly added inline forms
        const container = document.querySelector('.inline-group');
        if (!container) return;

        const observer = new MutationObserver(() => {
            // Re-run visibility updates when new inlines are added
            const typeSelect = document.querySelector('#id_type');
            if (typeSelect) {
                handleTypeChange();
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id', 'name']
        });
    }

    /**
     * Initialize when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        initDynamicFields();
        setupInlineObserver();

        // Also trigger on jquery-ready if using older Django versions
        if (typeof django !== 'undefined' && django.jQuery) {
            django.jQuery(document).ready(function() {
                initDynamicFields();
                setupInlineObserver();
            });
        }
    });

    // Export for testing if needed
    window.ToolAdminDynamic = {
        initDynamicFields,
        handleTypeChange,
        findInlineSection,
        updateExampleFieldsForType
    };
})();