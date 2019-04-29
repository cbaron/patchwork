module.exports = p => {
    const heading = p.opts.heading ? `<div class="heading">${p.opts.heading}</div>` : ``;
    const deleteBtn = p.opts.delete
        ? `<div data-js="deleteBtn" class="fd-hidden delete">${p.GetIcon('garbage')}</div>` : ``;
    const prompt  = p.opts.prompt ?  `<div class="prompt">${p.opts.prompt}</div>` : ``;
    const fields = p.GetFormFields( p.attributes, p.model, p.meta );
    const buttonRow = p.opts.hideButtonRow
        ? ``
        : `<div class="btn-row">
            <button class="btn-submit" data-js="submitBtn" type="button">
                <span>${p.opts.submitText || 'Submit'}</span>
            </button>
            <button class="btn-cancel" data-js="cancelBtn" type="button">
                <span>${p.opts.cancelText || 'Cancel'}</span>
            </button>
        </div>`;

return `<section>
    ${heading}
    <div class="form-box">
        ${prompt}
        <form data-js="form">${fields}</form>
        ${buttonRow}
        ${deleteBtn}
    </div>
</section>`
}
