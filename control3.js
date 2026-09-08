import * as HELPER from "./helpers.js"

/* new game */
const newGame = async (gameObject, gameEls) => {
    await loadSelectionBox(true)
    const userSelection = await waitForSelection()
    configureGame(userSelection, gameObject)
    await gameCountDown(5)
    await showGameElements(gameEls)
    /* test function mode */
    addFieldReactivity(gameObject, gameEls)
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
    const sideSelectors = document.querySelectorAll(".sideSelector")
    return new Promise((resolve) => {
        const controller = new AbortController()
        const { signal } = controller
        sideSelectors.forEach(item => {
            item.addEventListener("click", async (e) => {
                await loadSelectionBox(false)
                controller.abort()
                resolve(e.target.id === "selectorLeft" ? "left" : "right")
            }, { signal })
        })
    })
}

const configureGame = (userSelection, gameObject) => {
    gameObject.userField = userSelection
    gameObject.userBar = document.querySelector(`#${userSelection}Bar`)
    console.log(userSelection, gameObject)
}

const gameCountDown = async (time) => {
    const countDownBox = document.querySelector("#countDownBox")
    countDownBox.classList.remove("hidden")

    for (let i = time; i >= 0; i--) {
        const number = HELPER.addTag(countDownBox, "div", "absolute number tempo1000")
        number.textContent = i
        await HELPER.sleep(100)
        number.classList.add("number_in")
        await HELPER.sleep(900)
        countDownBox.innerHTML = ""
    }
}

const showGameElements = async (gameEls) => {
    const tempo = HELPER.getTime(gameEls.ball)
    Object.values(gameEls).forEach(item => item.classList.remove("invisible"))
    await HELPER.sleep(tempo)
}

/* reactivity */
const addFieldReactivity = (gameObject, gameEls) => {
    const more = document.getElementById("more")
    const less = document.getElementById("less")
    const fieldSizeButtons = [more, less]

    fieldSizeButtons.forEach(item => {
        !item.classList.contains("active") && item.classList.add("active")
        item.addEventListener("click", (e) => {
            console.log(e.target.id)
            moveFieldLine(gameObject, gameEls)
        })
    })
}

const moveFieldLine = async (gameObject, gameEls) => {
    const fieldRect = gameEls.field.getBoundingClientRect()
    const lineRect = gameEls.line.getBoundingClientRect()
    const lineLeft = lineRect.left - fieldRect.left + lineRect.width / 2


    gameObject.linePos = +((lineLeft / fieldRect.width) * 100).toFixed(2)
    console.log(gameObject.linePos, lineLeft)
}

/* init */
const init = async () => {
    const newButton = document.getElementById("new")
    const gameEls = {
        ball: document.querySelector("#ball"),
        barLeft: document.querySelector("#leftBar"),
        barRight: document.querySelector("#rightBar"),
        line: document.querySelector("#fieldLine"),
        field: document.querySelector("#gameField")
    }

    const game = {}

    newButton.addEventListener("click", async () => {
/*         addFieldReactivity()
 */        await newGame(game, gameEls)
    })


}

init()