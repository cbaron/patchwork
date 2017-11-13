module.exports = ( { opts } ) =>
`<section>
    <p>${opts.message}</p>
    <div class="button-row">
       <button data-js="submitBtn" class="btn-submit">Delete</button>
       <button data-js="cancelBtn" class="btn-cancel">Cancel</button>
    </div>
</section>`
