JavaScript Rock Dodger
---

## Objectives

1. Use JavaScript to build a rock-dodging game
2. Explain how `window.requestAnimationFrame()` is used to animate movement on a page
3. Explain how to use `setInterval()`
4. Show off your JavaScript know-how

## Instructions

You did it — you've made it to the end of the introductory JavaScript curriculum. You've learned how to write JavaScript and how to use JavaScript to manipulate the DOM. Now, only this lab stands between you and ~~freedom~~ the end of this course!

So that we don't catch you off-guard, know that this project is meant to be difficult. We're really testing the limits of what we've learned so far. But know that we've solved the lab using only things that we've taught — well, mostly. There are two things (which we've partially implemented for you) that you should know about.

### `window.requestAnimationFrame()`

This function tells the browser that we want to animate some change on the page. We'll use it in this lab for animating the movement of rocks and the dodger.

We can use [`window.requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) by passing it a callback that contains our animation:

``` javascript
function move(el) {
  var top = 0

  function step() {
    el.style.top = `${top += 2}px`

    if (top < 200) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}
```

If we call `move(el)` with a valid DOM element, `window.requestAnimationFrame()` will be called with the function `step`, which moves the `el` down the page in two-pixel increments until it's been moved 200 pixels. Pretty easy, right?

(Note that we can pass `step` to `window.requestAnimationFrame()` _inside_ of `step`. This is a nifty feature of JavaScript (and other languages) called [_recursion_](https://en.wikipedia.org/wiki/Recursion_(computer_science)). Don't worry if this concept makes your head spin a bit — that feeling is normal. For now, know that we can use `window.requestAnimationFrame()` as demonstrated above.)

### `setInterval()`

[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) takes two arguments: a callback, and an interval in milliseconds. We can use it like so:

``` javascript
function sayHello() {
  console.log('hello')
}

const myInterval = setInterval(sayHello, 1000)
```

The above will print `'hello'` to console once every second.

Note that `setInterval()` returns a reference to the interval. We can stop the interval from executing by calling `clearInterval(myInterval)`.

### Getting Started

Open up `index.html` in your browser. You should see a black 400-by-400px box with a white square at the bottom. That square is the dodger — it can only move left and right.

Well, it _should_ be able to move only left and right — we'll need to implement that functionality!

Now open `index.js`. You'll see that we've defined a few functions for you, but we've left much of the file blank.

We've left enough comments to get you started, though, and we've defined all of he HTML and CSS that you'll need so that you can just focus on the JavaScript!

Remember to reload the page after updating and saving the file. You've got this!

Good luck!

## Resources

- [window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)
