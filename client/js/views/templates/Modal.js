module.exports = p =>
`<div data-js="container" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div data-js="header" class="modal-header">
        <button data-js="closeBtn" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" data-js="title"></h4>
      </div>
      <div data-js="body" class="modal-body"></div>
      <div data-js="footer" class="modal-footer">
        <button type="button" class="btn btn-default" data-js="cancelBtn" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-js="confirmBtn">Save</button>
      </div>
    </div>
  </div>
</div>`