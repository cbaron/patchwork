module.exports = p =>
`<div>
    <div>
        <h2>Weekly Reminder</h2>
        <div class="form">
            <div>
                <label>Get List By:</label>
                <select data-js="listSelect">
                    <option value="day">Day of Week</option>
                    <option value="deliveryType">Delivery Type</option>
                    <option value="singleGroup">Single Dropoff Group</option>
                    <option value="newsletter">Newsletter Subscribers</option>
                </select>
            </div>
            <div>
                <label>Choose Day:</label>
                <select data-js="daySelect"></select>
            </div>
            <div class="fd-hidden">
                <label>Choose Group:</label>
                <select data-js="singleGroupSelect"></select>
            </div>
            <div class="fd-hidden">
                <label>Choose Delivery Type:</label>
                <select data-js="deliveryTypeSelect">
                    <option value="home">Home Delivery</option>
                    <option value="groupDropoffs">Group Dropoff</option>
                    <option value="farm">Farm Pickup</option>
                </select>
            </div>
            <div>
                <label>Subject Line:</label>
                <input data-js="subjectLine" type="text" value="Weekly Reminder from Patchwork Gardens" />
            </div>
            <div class="upload">
                <label for="upload">Upload Attachment(s):</label>
                <input type="file" multiple="true" data-js="upload" />
            </div>
            <div>
                <label>Create Custom Text</label>
                <input data-js="customizeBtn" type="checkbox" />
            </div>
            <div class="fd-hidden custom-area" data-js="customArea">
                <div>
                    <label>Custom Text:</label>
                    <textarea data-js="customText" rows="10"></textarea>
                </div>
                <div>
                    <label>Replace default template</label>
                    <input data-js="replaceDefaultBtn" type="checkbox" />
                </div>
            </div>
            <div>
                <button type="button" data-js="viewBtn" class="btn-yellow">View Email List</button>
            </div>
        </div>
    </div>
    <div class="fd-hidden">
        <button type="button" data-js="sendEmailBtn" class="send-btn">Send Reminder Email</button>
    </div>
    <div class="results" data-js="results">
        <h4 class="fd-hidden" data-js="empty">No results</h4>
        <ol class="columns" data-js="columns"></ol>
        <div class="rows" data-js="rows"></div>
    </div>
</div>`