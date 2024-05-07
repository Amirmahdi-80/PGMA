(function () {
    'use strict';
    var BODY_BACKGROUNDS = [
    
    ];
    function Slider() {
        this.cards = document.querySelectorAll('.card');
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initEvents();
        this.setActivePlaceholder();
    }
    // initialize drag events
    Slider.prototype.initEvents = function () {
        document.addEventListener('touchstart', this.onStart.bind(this));
        document.addEventListener('touchmove', this.onMove.bind(this));
        document.addEventListener('touchend', this.onEnd.bind(this));
        document.addEventListener('mousedown', this.onStart.bind(this));
        document.addEventListener('mousemove', this.onMove.bind(this));
        document.addEventListener('mouseup', this.onEnd.bind(this));
    };
    // set active placeholder
    Slider.prototype.setActivePlaceholder = function () {
        var placeholders = document.querySelectorAll('.cards-placeholder__item');
        var activePlaceholder = document.querySelector('.cards-placeholder__item--active')
        if (activePlaceholder) {
            activePlaceholder.classList.remove('cards-placeholder__item--active');
        }
        placeholders[this.currentIndex].classList.add('cards-placeholder__item--active');
        var bodyEl = document.querySelector('body');
        bodyEl.style.backgroundColor = BODY_BACKGROUNDS[this.currentIndex];
    };
    // mousedown event
    Slider.prototype.onStart = function (evt) {
        this.isDragging = true;
        this.currentX = evt.pageX || evt.touches[0].pageX;
        this.startX = this.currentX;
        var card = this.cards[this.currentIndex];
        // calculate ration to use in parallax effect
        this.windowWidth = window.innerWidth;
        this.cardWidth = card.offsetWidth;
        this.ratio = this.windowWidth / (this.cardWidth / 4);
    };
    // mouseup event
    Slider.prototype.onEnd = function (evt) {
        this.isDragging = false;
        var diff = this.startX - this.currentX;
        var direction = (diff > 0) ? 'left' : 'right';
        this.startX = 0;
        if (Math.abs(diff) > this.windowWidth / 4) {
            if (direction === 'left') {
                this.slideLeft();
            } else if (direction === 'right') {
                this.slideRight();
            } else {
                this.cancelMoveCard();
            }
        } else {
            this.cancelMoveCard();
        }
    };
    // mousemove event
    Slider.prototype.onMove = function (evt) {
        if (!this.isDragging) return;
        this.currentX = evt.pageX || evt.touches[0].pageX;
        var diff = this.startX - this.currentX;
        diff *= -1;
        // don't let drag way from the center more than quarter of window
        if (Math.abs(diff) > this.windowWidth / 2) {
            if (diff > 0) {
                diff = this.windowWidth / 2;
            } else {
                diff = - this.windowWidth / 2;
            }
        }
        this.moveCard(diff);
    };
    // slide to left direction
    Slider.prototype.slideLeft = function () {
        // if last don't do nothing
        if (this.currentIndex === this.cards.length - 1) {
            this.cancelMoveCard();
            return;
        }
        var self = this;
        var card = this.cards[this.currentIndex];
        var cardWidth = this.windowWidth / 2;
        card.style.left = '-50%';
        this.resetCardElsPosition();
        this.currentIndex += 1;
        this.setActivePlaceholder();
        card = this.cards[this.currentIndex];
        card.style.left = '50%';
        this.moveCardEls(cardWidth * 4);
        // add delay to resetting position
        setTimeout(function () {
            self.resetCardElsPosition();
        }, 50);
    };
    // slide to right direction
    Slider.prototype.slideRight = function () {
        // if last don't do nothing
        if (this.currentIndex === 0) {
            this.cancelMoveCard();
            return;
        }
        var self = this;
        var card = this.cards[this.currentIndex];
        var cardWidth = this.windowWidth / 2;
        card.style.left = '150%';
        this.resetCardElsPosition();
        this.currentIndex -= 1;
        this.setActivePlaceholder();
        card = this.cards[this.currentIndex];
        card.style.left = '50%';
        this.moveCardEls(-cardWidth * 4);
        // add delay to resetting position
        setTimeout(function () {
            self.resetCardElsPosition();
        }, 50);
    };
    // put active card in original position (center)
    Slider.prototype.cancelMoveCard = function () {
        var self = this;
        var card = this.cards[this.currentIndex];
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = '';
        this.resetCardElsPosition();
    };
    // reset to original position elements of card
    Slider.prototype.resetCardElsPosition = function () {
        var self = this;
        var card = this.cards[this.currentIndex];
        var cardTitle = card.querySelector('.card__title');
        var cardSubtitle = card.querySelector('.card__subtitle');
        var cardWillAnimate = card.querySelectorAll('.card__will-animate');
        // move card elements to original position
        cardWillAnimate.forEach(function (el) {
            el.style.transition = 'transform 0.5s ease-out';
        });
        cardTitle.style.transform = '';
        cardSubtitle.style.transform = '';
        // clear transitions
        setTimeout(function () {
            card.style.transform = '';
            card.style.transition = '';
            cardWillAnimate.forEach(function (el) {
                el.style.transition = '';
            });
        }, 500);
    };
    // slide card while dragging
    Slider.prototype.moveCard = function (diff) {
        var card = this.cards[this.currentIndex];
        card.style.transform = 'translateX(calc(' + diff + 'px - 50%))';
        diff *= -1;
        this.moveCardEls(diff);
    };
    // create parallax effect on card elements sliding them
    Slider.prototype.moveCardEls = function (diff) {
        var card = this.cards[this.currentIndex];
        var cardLogo = card.querySelector('.card__logo');
        var cardTitle = card.querySelector('.card__title');
        var cardSubtitle = card.querySelector('.card__subtitle');
        var cardImage = card.querySelector('.card__image');
        var cardWishList = card.querySelector('.card__wish-list');
        var cardWillAnimate = card.querySelectorAll('.card__will-animate');
        cardLogo.style.transform = 'translateX(' + (diff / this.ratio) + 'px)';
        cardPrice.style.transform = 'translateX(' + (diff / this.ratio) + 'px)';
        cardTitle.style.transform = 'translateX(' + (diff / (this.ratio * 0.90)) + 'px)';
        cardSubtitle.style.transform = 'translateX(' + (diff / (this.ratio * 0.85)) + 'px)';
        cardImage.style.transform = 'translateX(' + (diff / (this.ratio * 0.35)) + 'px)';
        cardWishList.style.transform = 'translateX(' + (diff / (this.ratio * 0.85)) + 'px)';
    };
    // create slider
    var slider = new Slider();
})();
const menu = document.querySelector('.menu-btn');
const topLeftSlider = document.querySelector('.top-left-slide');
const bottomLeftSlider = document.querySelector('.bottom-left-slide');

const topRightSlider = document.querySelector('.top-right-slide');
const middleRightSlider = document.querySelector('.middle-right-slide');
const bottomRightSlider = document.querySelector('.bottom-right-slide');

const eksOne = document.querySelector('.eks-one');
const eksTwo = document.querySelector('.eks-two');
const eksThree = document.querySelector('.eks-three');

var isOpen = false;
menu.addEventListener('click', () => {
    topLeftSlider.classList.toggle('top-left-slide-show');
    bottomLeftSlider.classList.toggle('bottom-left-slide-show');
    topRightSlider.classList.toggle('top-right-slide-show');
    middleRightSlider.classList.toggle('middle-right-slide-show');
    bottomRightSlider.classList.toggle('bottom-right-slide-show');
    eksTwo.classList.toggle('eks-two-fade');
    const Amir = document.getElementById("block")
    Amir.classList.toggle("active2")
    const Amir2 = document.getElementById("No9")
    Amir2.classList.toggle("active3")

    const tl = gsap.timeline();
    const tlEksThree = gsap.timeline();

    if (!isOpen) {
        tl.to('.eks-one', {
            y: isOpen ? 0 : 9,
        })
            .to('.eks-one', {
                rotate: isOpen ? 0 : 45
            })

        tlEksThree.to('.eks-three', {
            y: isOpen ? 0 : -9,
        })
            .to('.eks-three', {
                rotate: isOpen ? 0 : -45
            })
    }
    else {
        tl.to('.eks-one', {
            rotate: isOpen ? 0 : 45,
        })
            .to('.eks-one', {
                y: isOpen ? 0 : 9,
            })

        tlEksThree.to('.eks-three', {
            rotate: isOpen ? 0 : -45
        })
            .to('.eks-three', {
                y: isOpen ? 0 : -9
            })
    }

    isOpen = !isOpen
})

gsap.from('.simple', {
    x: -100,
    duration: 1
})
gsap.from('.menu', {
    x: -100,
    duration: 1.2,
    delay: 0.3,
    opacity: 0
})
gsap.from('.navi', {
    y: -500,
    duration: 2.,
    delay: 0.4,
    opacity: 0
})
function Search(){
    var No1=document.getElementById("in1")
    No1.classList.toggle("active")
    var No2=document.getElementById("Sear")
    No2.classList.toggle("active")
}
window.onload=(event)=>{
    var date=new Date();
    var Time2 =date.toLocaleString();
    document.getElementById("date").innerHTML=Time2
}
function welcomeFunction() {
    var date = new Date();
    var Time2 = date.toLocaleTimeString();
    document.getElementById("date").innerHTML = Time2
}
function Mobl(){
    document.getElementById("Mobl").classList.toggle("active")
}
function Mobl2(){
    document.getElementById("Mobl").classList.remove("active")
}
function Mobl3(){
    document.getElementById("Mobl").classList.toggle("active")
}
function Mobl4(){
    document.getElementById("Mobl").classList.remove("active")
}
function qaza1(){
    document.getElementById("qaza").classList.toggle("active")
}
function qaza2(){
    document.getElementById("qaza").classList.remove("active")
}
function qaza3(){
    document.getElementById("qaza").classList.toggle("active")
}
function qaza4(){
    document.getElementById("qaza").classList.remove("active")
}
function khab1(){
    document.getElementById("khab").classList.toggle("active")
}
function khab2(){
    document.getElementById("khab").classList.remove("active")
}
function khab3(){
    document.getElementById("khab").classList.toggle("active")
}
function khab4(){
    document.getElementById("khab").classList.remove("active")
}
function dec1(){
    document.getElementById("decorative").classList.toggle("active")
}
function dec2(){
    document.getElementById("decorative").classList.remove("active")
}
function dec3(){
    document.getElementById("decorative").classList.toggle("active")
}
function dec4(){
    document.getElementById("decorative").classList.remove("active")
}
function light1(){
    document.getElementById("lighting").classList.toggle("active")
}
function light2(){
    document.getElementById("lighting").classList.remove("active")
}
function light3(){
    document.getElementById("lighting").classList.toggle("active")
}
function light4(){
    document.getElementById("lighting").classList.remove("active")
}
function f1(){
    document.getElementById("f1").classList.toggle("active")
}
function f2(){
    document.getElementById("f2").classList.toggle("active")
}
function f3(){
    document.getElementById("f3").classList.toggle("active")
}
function f4(){
    document.getElementById("f4").classList.toggle("active")
}
// Written by Amirmahdi Asadi