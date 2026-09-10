export const getTime = (element) => {
    return parseFloat(getComputedStyle(element).getPropertyValue("transition")) * 1000
}

export const sleep = async (tempo) => { 
    await new Promise(resolve => setTimeout(resolve, tempo)) 
}

export const addTag = (box, tag, classes) => {
    const newTag = document.createElement(tag)
    newTag.className = classes
    return box.appendChild(newTag)
}

export const setRootVar = (varName, value) => {
    document.documentElement.style.setProperty(varName, value)
}

export const setElementProp = (element, prop, value) => {
    element.style.setProperty(prop, value)
}

export const getElementProp = (element, prop) => {
    return getComputedStyle(element).getPropertyValue(prop).trim()
}