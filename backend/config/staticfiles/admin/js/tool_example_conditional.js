document.addEventListener("DOMContentLoaded", function () {
    const typeSelect = document.querySelector("#id_type");
    if (!typeSelect) return;

    const fieldMap = {
        text_to_text: ["prompt", "result_text"],
        text_to_image: ["prompt", "result_image"],
        text_to_video: ["prompt", "result_video"],
        text_to_audio: ["prompt", "result_audio"],
        image_to_image: ["input_image", "result_image"],
    };

    const allFields = [
        "prompt",
        "input_image",
        "result_text",
        "result_image",
        "result_video",
        "result_audio",
    ];

    function toggleFields() {
        const selected = typeSelect.value;
        const visibleFields = fieldMap[selected] || [];

        allFields.forEach((field) => {
            const fieldRow = document.querySelector(`.form-row.field-${field}`);
            if (fieldRow) {
                fieldRow.style.display = visibleFields.includes(field) ? "" : "none";
            }
        });
    }

    // Run on load and on change
    toggleFields();
    typeSelect.addEventListener("change", toggleFields);
});
