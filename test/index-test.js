describe('Rock Dodger', () => {
  afterEach(function() {
    expect.restoreSpies()
  })

  describe('checkCollision(rock)', () => {
    /**
     * DODGER starts out at left = 180px
     */
    describe('rock is <= 360px from the top of GAME', () => {
      it('does not collide', () => {
        let rock = document.createElement('div')
        rock.className = 'rock'
        rock.style.top = '2px'
        rock.style.left = '0px'

        expect(checkCollision(rock)).toNotBe(true)

        rock = null
      })
    })

    describe('rock is > 360px from the top of GAME', () => {
      let rock

      beforeEach(() => {
        rock = document.createElement('div')
        rock.className = 'rock'
        rock.style.top = '362px'
      })

      afterEach(() => {
        rock = null
      })

      it('does not collide if not within DODGER\'s bounds', () => {
        rock.style.left = '0px'

        expect(checkCollision(rock)).toNotBe(true)
      })

      it("collides if the rock's left edge is <= the DODGER's left edge and the rock's right edge is >= the DODGER's left edge", () => {
        rock.style.left = '170px'

        expect(checkCollision(rock)).toBe(true)
      })

      it("collides if the rock's left edge is >= the DODGER's left edge and the rock's right edge is <= the DODGER's right edge", () => {
        rock.style.left = '180px'

        expect(checkCollision(rock)).toBe(true)
      })

      it("collides if the rock's left edge is <= the DODGER's right edge and the rock's right edge is >= the DODGER's right edge", () => {
        rock.style.left = '219px'

        expect(checkCollision(rock)).toBe(true)
      })
    })
  })

  describe('createRock(x)', () => {
    let rock, spy
    beforeEach(() => {
      // this slight hack lets us run the tests both
      // in the browser and in jsdom
      if (typeof window.requestAnimationFrame !== 'undefined') {
        spy = expect.spyOn(window, 'requestAnimationFrame')
      } else {
        spy = window.requestAnimationFrame = expect.createSpy()
      }

      rock = createRock(2)
    })

    afterEach(() => {
      rock = null
      spy = null
    })

    it('creates a rock with a given `style.left` value', () => {
      expect(rock.style.left).toEqual('2px')
    })

    it('calls window.requestAnimationFrame()', () => {
      expect(spy).toHaveBeenCalled()
    })

    describe('moveRock()', () => {
      it('checks for a collision', () => {
        let called = false

        const spy = expect.spyOn(window, 'checkCollision')

        window.requestAnimationFrame = cb => {
          if (!called) {
            called = true
            cb()
          }
        }

        createRock(4)

        expect(spy).toHaveBeenCalled()
      })

      it('ends the game if there is a collision', () => {
        const spy = expect.spyOn(window, 'endGame')
        const stub = expect.spyOn(window, 'checkCollision').andReturn(true)

        window.requestAnimationFrame = cb => {
          cb()
        }

        createRock(182)

        expect(spy).toHaveBeenCalled()

        window.checkCollision.restore()
      })

      it('removes the rock once it falls of the screen', done => {
        window.requestAnimationFrame = cb => {
          setInterval(cb, 0)
        }

        const rock = createRock(2)
        const spy = expect.spyOn(rock, 'remove')

        // Janky setTimeout to let the rock fall
        // off the screen
        setTimeout(() => {
          expect(spy).toHaveBeenCalled()
          done()
        }, 50)
      })
    })
  })

  describe('endGame()', () => {
    it('clears gameInterval', () => {
      const spy = expect.spyOn(window, 'clearInterval')

      endGame()

      expect(spy).toHaveBeenCalled()
    })

    it('removes all of the rocks', () => {
      // noop
      window.requestAnimationFrame = () => {}

      let spies = []

      for (let i = 0; i < 4; i++) {
        let rock = createRock(i)

        spies.push(expect.spyOn(rock, 'remove'))
      }

      endGame()

      for (let i = 0; i < 4; i++) {
        expect(spies[i]).toHaveBeenCalled()
      }
    })

    it('removes the "keydown" event listener', () => {
      const spy = expect.spyOn(document, 'removeEventListener')

      endGame()

      expect(spy).toHaveBeenCalledWith('keydown', moveDodger)
    })
  })

  describe('moveDodger(e)', () => {
    beforeEach(() => {
      window.requestAnimationFrame = () => {}
    })

    describe('e.which !== LEFT_ARROW && e.which !== RIGHT_ARROW', () => {
      it('does nothing', () => {
        const e = {
          preventDefault: expect.createSpy(),
          stopPropagation: expect.createSpy(),
          which: 1
        }
        const l = expect.spyOn(window, 'moveDodgerLeft')
        const r = expect.spyOn(window, 'moveDodgerRight')

        moveDodger(e)

        expect(e.preventDefault).toNotHaveBeenCalled()
        expect(e.stopPropagation).toNotHaveBeenCalled()
        expect(l).toNotHaveBeenCalled()
        expect(r).toNotHaveBeenCalled()

        window.moveDodgerLeft.restore()
        window.moveDodgerRight.restore()
      })
    })

    describe('e.which === LEFT_ARROW', () => {
      let e, spy

      beforeEach(() => {
        spy = expect.createSpy()
        e = {
          preventDefault: () => {},
          stopPropagation: () => {},
          which: 37
        }
      })

      it('calls e.preventDefault()', () => {
        e.preventDefault = spy

        moveDodger(e)

        expect(spy).toHaveBeenCalled()
      })

      it('calls e.stopPropagation()', () => {
        e.stopPropagation = spy

        moveDodger(e)

        expect(spy).toHaveBeenCalled()
      })

      it('calls moveDodgerLeft()', () => {
        const f = expect.spyOn(window, 'moveDodgerLeft')

        moveDodger(e)

        expect(f).toHaveBeenCalled()

        window.moveDodgerLeft.restore()
      })
    })

    describe('e.which === RIGHT_ARROW', () => {
      let e, spy

      beforeEach(() => {
        spy = expect.createSpy()
        e = {
          preventDefault: () => {},
          stopPropagation: () => {},
          which: 39
        }
      })

      it('calls e.preventDefault()', () => {
        e.preventDefault = spy

        moveDodger(e)

        expect(spy).toHaveBeenCalled()
      })

      it('calls e.stopPropagation()', () => {
        e.stopPropagation = spy

        moveDodger(e)

        expect(spy).toHaveBeenCalled()
      })

      it('calls moveDodgerRight()', () => {
        const f = expect.spyOn(window, 'moveDodgerRight')

        moveDodger(e)

        expect(f).toHaveBeenCalled()

        window.moveDodgerRight.restore()
      })
    })
  })

  describe('moveDodgerLeft()', () => {
    beforeEach(() => {
      dodger = document.getElementById('dodger')

      window.requestAnimationFrame = cb => {
        cb()
      }
    })

    it('moves the DODGER to the left', () => {
      const left = positionToInteger(dodger.style.left)

      moveDodgerLeft()

      expect(positionToInteger(dodger.style.left)).toBeLessThan(left)
    })

    it('does not move the DODGER left if the DODGER\'s left edge already touches the left edge of GAME', () => {
      dodger.style.left = '0px'

      moveDodgerLeft()

      expect(dodger.style.left).toEqual('0px')
    })
  })

  describe('moveDodgerRight', () => {
    beforeEach(() => {
      dodger = document.getElementById('dodger')

      window.requestAnimationFrame = cb => {
        cb()
      }
    })

    it('moves the DODGER to the right', () => {
      const left = positionToInteger(dodger.style.left)

      moveDodgerRight()

      expect(positionToInteger(dodger.style.left)).toBeGreaterThan(left)
    })

    it('does not move the DODGER left if the DODGER\'s right edge already touches the right edge of GAME', () => {
      dodger.style.left = '360px'

      moveDodgerRight()

      expect(dodger.style.left).toEqual('360px')
    })
  })
})
