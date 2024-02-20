console.log('inside main.js');
console.log('document title is %s', document.title);

// Class definitions
class Diaper {
    constructor() {
        this.num1 = false;
        this.num2 = false;
        this.eventTextBox = document.getElementById('diaper-event-log-txt');
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

class ChildData {
    householdId;
    childId;

    constructor() {
        this.householdId = 0;
        this.childId = 0;
    }
}

class Event {
    eventDateTime;
    eventData;
    childData;

    constructor() {
        this.eventDateTime = new Date();
        this.childData = new ChildData();
    }

    toJson() {
        const jsonOut = {
            "datetime": "YYYY-MM-DDTHH:mm",
            "eventData": {
                "eventtype": "feeding"
            },
            "childData": {
                "householdId": 1,
                "childId": 1
            }
        };

        // set our textbox to JSON output
        this.eventData.eventTextBox.textContent = JSON.stringify(jsonOut, null, 2);
        console.log(JSON.stringify(jsonOut, null, 2));
    }
}

class Feeding {
    constructor() {
        this.feedingType = `none`;
        this.feedingEventTxtBox = document.getElementById('feeding-event-log-txt');
    }

    setFeedingType(feedingType) {
        this.feedingType = feedingType;
    }

    setFeedingTypeBoob() {
        this.feedingType = 'boob';

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

    setFeedingTypeBottle() {
        this.feedingType = 'bottle';

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
const diaper = new Diaper();
const feeding = new Feeding();
const logger = new Logger();
const diaperEvent = new Event();
diaperEvent.eventData = diaper;


// Static Init
diaperEvent.eventData.eventTextBox.textContent = `this is some dummy text`;
diaperEvent.toJson();

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
    var childElement = document.getElementById('feeding-log-form');

    // Toggle between displaying or not displaying form
    if (childElement.style.display == 'block') {
        // TODO: update this to clear out the form data if you close it
        childElement.style.display = 'none';
    }
    else {
        childElement.style.display = 'block'
    }
}

// Click handler for Diaper Log Submit
document.getElementById('diaper-submit-button').onclick = function () {
    alert(`Send it!`);
}

// Click handler for Diaper Cancel Submit
document.getElementById('diaper-cancel-button').onclick = function () {
    alert(`Cancel it!`);

    var childElement = document.getElementById('diaper-log-form');

    // Toggle between displaying or not displaying form
    if (childElement.style.display == 'block') {
        // TODO: update this to clear out the form data if you close it
        childElement.style.display = 'none';
    }
    else {
        childElement.style.display = 'block'
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
    feeding.setFeedingTypeBoob();
}

function bottleOptionClickHandler() {
    feeding.setFeedingTypeBottle();
}