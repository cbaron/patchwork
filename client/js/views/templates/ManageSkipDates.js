module.exports = p =>
`<section>
  <h4>Manage Skip Dates</h4>
  <form>
    <div>
      <div>
        <label>Choose Season:</label>
        <select data-js="seasonSelection"></select>
      </div>
    </div>
    <div>
      <button type="button" data-js="saveBtn" class="btn-yellow">Save Changes</button>
    </div>
  </form>
  <div class="results" data-js="results">
    <ol data-js="dates"></ol>
  </div>
</section>`
