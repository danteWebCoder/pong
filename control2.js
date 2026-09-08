import * as HELPER from "./helpers.js"



const sideSelectors = document.querySelectorAll(".sideSelector")
const barSteps = 8

const game = {
    side: null,
    speed: 1,
    ballSize: parseFloat(getComputedStyle(gameElements.ball).getPropertyValue("width")),
    bar: null,
    barSize: null,
    barIndex: 4,
}

/* PREPARE NEW GAME */
const prepareNewGame = async () => {

    const fields = {
        selected: null,
        user: null,
        userDim: null,
        nonUser: null,
        nonUserDim: null
    }

    await loadSelectionBox(true)
    const sideSelected = await waitForSelection()
    await countDown()
    await displayElements()
    return sideSelected
}

const loadSelectionBox = async (open) => {
    const selectionBox = document.querySelector("#selectionBox")
    const boxTempo = HELPER.getTime(selectionBox)
    if (open) {
        selectionBox.classList.remove("hidden")
        await HELPER.sleep(100)
        selectionBox.classList.remove("invisible", "selectionBox_contracted")
        selectionBox.classList.add("selectionBox_expanded")
        await HELPER.sleep(boxTempo)
    } else {
        selectionBox.classList.remove("selectionBox_expanded")
        selectionBox.classList.add("invisible", "selectionBox_contracted")
        await HELPER.sleep(boxTempo)
        selectionBox.classList.add("hidden")
    }
}

const waitForSelection = async () => {
    return new Promise((resolve) => {
        const controller = new AbortController()
        const { signal } = controller
        sideSelectors.forEach(item => {
            item.addEventListener("click", async (e) => {
                await loadSelectionBox(false)
                controller.abort()
/*                 game.side = e.target.id === "selectorLeft" ? "left" : "right"
                game.bar = document.querySelector(game.side === "left" ? "#barLeft" : "#barRight")
 */                resolve(e.target.id === "selectorLeft" ? "left" : "right")
            }, { signal })
        })
    })
}

const displayElements = async () => {
    const tempo = HELPER.getTime(gameElements.ball)
/*     await countDown()
 */    Object.values(gameElements).forEach(item => item.classList.remove("invisible"))
    await HELPER.sleep(tempo)
}

const countDown = async () => {
    const countDownBox = document.querySelector("#countDownBox")
    countDownBox.classList.remove("hidden")

    for (let i = 3; i >= 0; i--) {
        const number = HELPER.addTag(countDownBox, "div", "absolute number tempo1000")
        number.textContent = i
        await HELPER.sleep(100)
        number.classList.add("number_in")
        await HELPER.sleep(900)
        countDownBox.innerHTML = ""
    }
}

/* INIT GAME */
const initGame = () => {
    events_moveBar()
/*     moveBall(game.side === "left" ? 0 : 90, 270)
 */    getFrame()
}

const events_moveBar = () => {
    document.addEventListener("keydown", (e) => {
        e.code === "ArrowLeft" && moveBar("up")
        e.code === "ArrowRight" && moveBar("down")
    })

    window.addEventListener("wheel", (e) => {
        e.deltaY < 0 && moveBar("up")
        e.deltaY > 0 && moveBar("down")
    })
}

const moveBar = (direction) => {
    const barHeightPercent = (game.bar.offsetHeight / fieldDim.y) * 100
    const moveStep = (100 - barHeightPercent) / barSteps
    if (direction === "up" && game.barIndex > 0) game.barIndex--
    if (direction === "down" && game.barIndex < barSteps) game.barIndex++
    game.bar.style.top = `${moveStep * game.barIndex}%`
}


const getBarPos = () => {
    const bar = game.side === "left" ? gameElements.barLeft : gameElements.barRight
    const barHeight = (bar.offsetHeight / fieldDim.y) * 100
    const barTop = +(bar.offsetTop / fieldDim.y) * 100 /* + to number instant */
    console.log()
    return [barTop, barHeight]
}


const getFrame = () => {
    const barPos = getBarPos()
    console.log(barPos)
    requestAnimationFrame(getFrame)
}

/* init */
const init = async () => {
    const gameElements = {
        ball: document.querySelector("#ball"),
        barLeft: document.querySelector("#barLeft"),
        barRight: document.querySelector("#barRight"),
        fieldSeparator: document.querySelector("#fieldSeparator"),
    }

    const fieldEl = document.querySelector("#gameField")
    let fieldRect = fieldEl.getBoundingClientRect()
    let fieldDim = { "x": fieldRect.width, "y": fieldRect.height }

    const gameSide = await prepareNewGame()
    console.log(gameSide)
    /*     initGame()
     */
}

init()