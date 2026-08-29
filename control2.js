import * as HELPER from "./helpers.js"

const gameBox = document.querySelector("#gameBox")
const ball = document.querySelector("#ball")
const barLeft = document.querySelector("#barLeft")
const barRight = document.querySelector("#barRight")
const fieldSeparator = document.querySelector("#fieldSeparator")
const pressSpace = document.querySelector(".pressSpace")
const sideSelectors = document.querySelectorAll(".sideSelector")

const ballSize = parseFloat(getComputedStyle(ball).getPropertyValue("width"))
const steps = 8
const tempo = 200

let gameBoxSize = null
let sideLeft = null
let bar = null
let barPos = null /* vertical center */

const getGameBoxSize = () => gameBoxSize = [gameBox.clientWidth, gameBox.clientHeight]
const getBallPos = () => { return [ball.offsetLeft, ball.offsetTop] }

/* NEW GAME */
const initNewGame = async () => {
    await activeSelectionBox(true)

    const controller = new AbortController()
    const { signal } = controller
    sideSelectors.forEach(item => {
        item.addEventListener("click", async (e) => {
            await activeSelectionBox(false)
            await prepareGameField(e.target.id)
            controller.abort()
        }, { signal })
    })
}

const activeSelectionBox = async (open) => {
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

const countDown = async () => {
    const countDownBox = document.querySelector("#countDownBox")
    countDownBox.classList.remove("hidden")
    let numberTempo = null

    for (let i = 3; i >= 0; i--) {
        const number = HELPER.addTag(countDownBox, "div", "absolute number tempo1000")
        number.textContent = i
        !numberTempo && (numberTempo = HELPER.getTime(number))
        await HELPER.sleep(100)
        number.classList.add("number_in")
        await HELPER.sleep(numberTempo - 100)
        countDownBox.innerHTML = ""
    }
}

const prepareGameField = async () => {
    const elementsTempo = HELPER.getTime(ball)
    const gameElements = [ball, fieldSeparator, barLeft, barRight]
    await countDown()
    ball.classList.add("ball_inCenter")
    gameElements.forEach(item => item.classList.remove("invisible"))
    await HELPER.sleep(elementsTempo)
}

/* init */
const init = async () => {
    await initNewGame()
}

init()