console.log('inside main.js');
console.log('document title is %s', document.title);

// Class definitions
class Diaper {
    constructor() {
        this.num1 = false;
        this.num2 = false;
    }

    toggleNum1() {
        this.num1 = !this.num1;
        console.log(`diaper.num1 toggled to ${this.num1}`);
    }

    toggleNum2() {
        this.num2 = !this.num2;
        console.log(`diaper.num2 toggled to ${this.num2}`);
    }

    toString() {
        return `numeroUno = ${this.num1}, numeroDos = ${this.num2}`;
    }
}

class Feeding {
    constructor() {
        this.feedingType = `none`;
    }

    setFeedingType(feedingType) {
        this.feedingType = feedingType;
    }

    toString() {
        return `feedType = ${this.feedingType}`;
    }
}

class Logger {
    #baseLogCmdText = `logBebeEvent(`
    #baseLogCmdTextEnd = `);`
    constructor() {

        this.logCmdText = this.#baseLogCmdText + this.#baseLogCmdTextEnd;
    }

    constructLogCmd(diaperString, feedingString) {
        this.logCmdText = this.#baseLogCmdText + diaperString + `, ` + feedingString + this.#baseLogCmdTextEnd;
        console.log(`logger constructed cmd ${this.logCmdText}`);
    }
}

// Globals
const logCommandElement = document.getElementById('logCmdText');
const diaper = new Diaper();
const feeding = new Feeding();
const logger = new Logger();


// Static Init
logger.constructLogCmd(diaper.toString(), feeding.toString());
logCommandElement.textContent = logger.logCmdText;
logCommandElement.textContent = logger.logCmdText;

// Click handler for Diaper Logging
document.getElementById('diaper-log-button').onclick = function () {
    var element = document.getElementById('diaper-log-form');

    // Toggle between displaying or not displaying form
    if (element.style.display == 'block') {
        // TODO: update this to clear out the form data if you close it
        element.style.display = 'none';
    }
    else {
        element.style.display = 'block'
    }
}

// Click handler for Feeding Logging
document.getElementById('feeding-log-button').onclick = function () {
    var element = document.getElementById('feeding-log-form');

    // Toggle between displaying or not displaying form
    if (element.style.display == 'block') {
        // TODO: update this to clear out the form data if you close it
        element.style.display = 'none';
    }
    else {
        element.style.display = 'block'
    }
}


// document.querySelectorAll('.clickable-list-item').forEach(element => element.addEventListener("mouseover", element => {
//     console.log('List item hovered');
// }));
document.querySelectorAll('.clickable-list-item').forEach(element => element.addEventListener("click", listItemClicked));



function listItemClicked(e) {
    e.target.classList.toggle(`clickable-list-item-selected`);

    switch (this.id) {
        case 'num1':
            if (!logCommandElement.textContent.includes(`eventNumero = 'uno'`)) {
                diaper.toggleNum1();
            }
            break;
        case 'num2':
            if (!logCommandElement.textContent.includes(`eventNumero = 'uno'`)) {
                diaper.toggleNum2();
            }
            break;
        case 'boob-option': {
            boobOptionClickHandler();
            break;
        }
        case 'bottle-option': {
            bottleOptionClickHandler();
            break;
        }
        default:
            console.log('unhandled item');
    }

    logger.constructLogCmd(diaper.toString(), feeding.toString());
    logCommandElement.textContent = logger.logCmdText;
}


function boobOptionClickHandler() {
    // If feeding type is already boob, then we want to 'deselect this?
    if (feeding.feedingType == `boob`) {
        return;
    }

    else {
        feeding.setFeedingType('boob');

        // Update the bottle to ensure that it's not considered selected
        const unselectedOption = document.getElementById('bottle-option');
        console.log(`unselected option classList ${unselectedOption.classList}`);
        unselectedOption.classList.remove(`clickable-list-item-selected`);

        const selectedObject = document.getElementById('boob-option');
        selectedObject.classList.add(`clickable-list-item-selected`);
        console.log(`selected option classList ${selectedObject.classList}`);

        // Now lets bring up the boob option form and ensure the bottle is closed
        const boobOptionForm = document.getElementById('boob-options-form');
        boobOptionForm.style.display = 'block';
        const bottleOptionForm = document.getElementById('bottle-options-form');
        bottleOptionForm.style.display = 'none';
    }
}

// TODO: consider moving these to the Feeding class to more closely link the view changes to the data changes (instead of how they are currently - tied to the specific event handler)
function bottleOptionClickHandler() {
    feeding.setFeedingType('bottle');

    // Update the bottle to ensure that it's not considered selected
    const unselectedOption = document.getElementById('boob-option');
    console.log(`unselected option classList ${unselectedOption.classList}`);
    unselectedOption.classList.remove(`clickable-list-item-selected`);

    const selectedObject = document.getElementById('bottle-option');
    selectedObject.classList.add(`clickable-list-item-selected`);
    console.log(`selected option classList ${selectedObject.classList}`);

    // Now lets bring up the bottle option form and ensure the boob is closed
    const boobOptionForm = document.getElementById('boob-options-form');
    boobOptionForm.style.display = 'none';
    const bottleOptionForm = document.getElementById('bottle-options-form');
    bottleOptionForm.style.display = 'block';
}