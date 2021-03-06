

function hideElement(element){
  element.style.visibility = "hidden"
}

var startHeight;
var stopHeight = 70;

var header;
var topNavContainer;

function initialiseScrollAdjuster(){
  header = document.getElementById('header');
  startHeight = header.offsetHeight;
  topNavContainer = document.getElementById('top-nav-container');
  scrollAdjuster();
}

function scrollAdjuster(){
  var scrollDistance = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  if(scrollDistance>=startHeight-stopHeight && scrollDistance !== 0){
    header.classList.add('box-shadow');
    header.style.height = stopHeight+"px";
  }else{
    header.classList.remove('box-shadow');
    header.style.height = startHeight - scrollDistance + "px";
  }

}

function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];

var transformProperty;

var dragMarginSize;
var width;
var navigationDrawer;
var smallGreyOut;
var sideNavDrag;

function initialiseSideNav(){
  transformProperty = getSupportedPropertyName(transform);

  navigationDrawer = document.getElementById('navigation-drawer');
  smallGreyOut = document.getElementById('small-grey-out');
  sideNavDrag = document.getElementById('side-nav-drag');
  dragMarginSize = sideNavDrag.getBoundingClientRect().right;
  width = navigationDrawer.getBoundingClientRect().width;
  currentX = -width;

  //
  sideNavDrag.addEventListener("touchstart",startDragSideNav,false);
  sideNavDrag.addEventListener("touchmove",dragSideNav, false);
  sideNavDrag.addEventListener("touchend",endDragSideNav,false);
  sideNavDrag.addEventListener("touchcancel",endDragSideNav,false);

  smallGreyOut.addEventListener("touchstart",startDragSideNav,false);
  smallGreyOut.addEventListener("touchmove",dragSideNav, false);
  smallGreyOut.addEventListener("touchend",endDragSideNav,false)
  smallGreyOut.addEventListener("touchcancel",endDragSideNav,false);
}


function expandSideNav(){
		navigationDrawer.style[transformProperty] = "translateX(0px)" ;
    sideNavDrag.style.paddingRight = "0";
    sideNavDrag.style.right="0";
		smallGreyOut.style.width="100%";
    smallGreyOut.style.opacity="1";
		document.getElementsByTagName('body')[0].style.overflow="hidden";
    currentX = 0;
}
function hideSideNav(){
    navigationDrawer.style[transformProperty] = "translateX(-100%)";

    sideNavDrag.style.paddingRight = dragMarginSize + "px";
    sideNavDrag.style.right = - dragMarginSize + "px";
		smallGreyOut.style.width="0%";
    smallGreyOut.style.opacity="0";
		document.getElementsByTagName('body')[0].style.overflow="initial";
    currentX = -width;
}


var previousTouchX = 0;
var currentX;
var opening = false;

function startDragSideNav(evt){
  previousTouchX = evt.changedTouches[0].pageX;
  navigationDrawer.classList.remove("transition");
  smallGreyOut.classList.remove("transition");
  smallGreyOut.style.width="100%";
}

function dragSideNav(evt){
  evt.preventDefault();
  var touches = evt.changedTouches;
  var touch = touches[0];
  if(touch.pageX - previousTouchX>0){
    opening = true;
  }else{
    opening = false;
  }
  currentX = currentX + touch.pageX - previousTouchX;
  previousTouchX = touch.pageX;
  if(currentX > 0){
    navigationDrawer.style[transformProperty] = "translateX(0px)";
    smallGreyOut.style.opacity = "1";
  }else{
    navigationDrawer.style[transformProperty]= "translateX("+currentX+"px)";
    smallGreyOut.style.opacity = (width+currentX)/(width);
  }
}

  function endDragSideNav(evt){
      navigationDrawer.classList.add("transition");
      smallGreyOut.classList.add("transition");
      if((width+currentX)/width>0.9){
        expandSideNav();
      }else if((width+currentX)/width<0.1){
        hideSideNav();
      }else if(opening){
        expandSideNav();
      }else{
        hideSideNav();
      }
  }

window.addEventListener("DOMContentLoaded", function() {
    initialiseSideNav();
    initialiseScrollAdjuster();

    window.addEventListener('scroll', function() {
        scrollAdjuster();
    });

	document.getElementById('side-nav-trigger').addEventListener('click', function() {
		expandSideNav();
	});

	document.getElementById('small-grey-out').addEventListener('click', function() {
		hideSideNav();
	});
});
