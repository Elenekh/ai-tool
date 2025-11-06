// Static file: static/admin/js/tool_example_toggle.js
// This script dynamically shows/hides fields based on selected tool type

(function() {
    'use strict';

    function findFieldRow(fieldName) {
        // Try multiple selectors to find the field row
        var selectors = [
            '.field-' + fieldName,
            '[class*="field-' + fieldName + '"]',
            'div[class*="' + fieldName + '"]'
        ];
        
        for (var i = 0; i < selectors.length; i++) {
            var element = document.querySelector(selectors[i]);
            if (element) {
                // Find the closest form-row or fieldset container
                var container = element.closest('.form-row') || 
                               element.closest('fieldset') || 
                               element.closest('div[class*="field"]') ||
                               element;
                return container;
            }
        }
        return null;
    }

    function toggleFields() {
        var typeSelect = document.querySelector('#id_type');
        if (!typeSelect) {
            console.log('Type select not found');
            return;
        }

        var selectedType = typeSelect.value;
        console.log('Selected type:', selectedType);
        
        // Get all demo field containers
        var promptField = findFieldRow('prompt');
        var promptImageField = findFieldRow('prompt_image');
        var resultTextField = findFieldRow('result_text');
        var resultImageField = findFieldRow('result_image');
        var resultVideoField = findFieldRow('result_video_url');
        var resultAudioField = findFieldRow('result_audio_url');

        console.log('Found fields:', {
            prompt: !!promptField,
            prompt_image: !!promptImageField,
            result_text: !!resultTextField,
            result_image: !!resultImageField,
            result_video_url: !!resultVideoField,
            result_audio_url: !!resultAudioField
        });

        // Hide all demo fields initially
        [promptField, promptImageField, resultTextField, resultImageField, resultVideoField, resultAudioField].forEach(function(field) {
            if (field) {
                field.style.display = 'none';
            }
        });

        // Show relevant fields based on type
        switch(selectedType) {
            case 'text-to-text':
                console.log('Showing text-to-text fields');
                if (promptField) promptField.style.display = '';
                if (resultTextField) resultTextField.style.display = '';
                break;
            
            case 'text-to-image':
                console.log('Showing text-to-image fields');
                if (promptField) promptField.style.display = '';
                if (resultImageField) resultImageField.style.display = '';
                break;
            
            case 'text-to-video':
                console.log('Showing text-to-video fields');
                if (promptField) promptField.style.display = '';
                if (resultVideoField) resultVideoField.style.display = '';
                break;
            
            case 'text-to-audio':
                console.log('Showing text-to-audio fields');
                if (promptField) promptField.style.display = '';
                if (resultAudioField) resultAudioField.style.display = '';
                break;
            
            case 'image-to-image':
                console.log('Showing image-to-image fields');
                if (promptField) promptField.style.display = '';
                if (promptImageField) promptImageField.style.display = '';
                if (resultImageField) resultImageField.style.display = '';
                break;
            
            case 'image-to-video':
                console.log('Showing image-to-video fields');
                if (promptField) promptField.style.display = '';
                if (promptImageField) promptImageField.style.display = '';
                if (resultVideoField) resultVideoField.style.display = '';
                break;
            
            case 'other':
                console.log('Showing all fields');
                // Show all fields
                if (promptField) promptField.style.display = '';
                if (promptImageField) promptImageField.style.display = '';
                if (resultTextField) resultTextField.style.display = '';
                if (resultImageField) resultImageField.style.display = '';
                if (resultVideoField) resultVideoField.style.display = '';
                if (resultAudioField) resultAudioField.style.display = '';
                break;
            
            default:
                console.log('No type selected - hiding all demo fields');
                // Keep all hidden if no type selected
        }
    }

    function init() {
        console.log('Initializing tool type toggle...');
        
        // Wait a bit for Django admin to fully load
        setTimeout(function() {
            toggleFields();
            
            var typeSelect = document.querySelector('#id_type');
            if (typeSelect) {
                console.log('Type select found, adding change listener');
                typeSelect.addEventListener('change', function() {
                    console.log('Type changed to:', this.value);
                    toggleFields();
                });
            } else {
                console.log('Type select NOT found');
            }
        }, 100);
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();