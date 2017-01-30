module.exports = p => `<div data-js="container" class="home-class client-view">
    <h4>Fresh food from farmers you know!</h4>
    <h3>
        <button data-js="signupBtn" class="btn btn-link signup-btn">Join our CSA!</button>
    </h3>
    <div data-js="carousel" id="carousel" class="carousel slide">
        <div data-js="carouselInner" class="carousel-inner" role="listbox"></div>
        <a class="left carousel-control" href="#carousel" role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#carousel" role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
</div>`
