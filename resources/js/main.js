console.log('inside main.js');
console.log('document title is %s', document.title);

const MS_PER_MIN = 60000;

// Class definitions
class Diaper {
    num1Button;
    num2Button;
    constructor() {
        this.typeName = `diaper change`;
        this.num1 = false;
        this.num2 = false;
        this.eventTextBox = document.getElementById('diaper-event-log-txt');
    }

    toggleNum1(event) {
        this.num1 = !this.num1;
        document.getElementById('num1').classList.toggle(`clickable-list-item-selected`);
    }

    toggleNum2(event) {
        this.num2 = !this.num2;
        document.getElementById('num2').classList.toggle(`clickable-list-item-selected`);
    }

    toString() {
        return `numeroUno = ${this.num1}, numeroDos = ${this.num2}`;
    }

    toJson() {
        const jsonOut = {
            "eventtype": "diaper",
            "eventoptions": {
                "numero1": this.num1,
                "numero2": this.num2
            }
        };

        return jsonOut;
    }

    // Reset 
    reset() {
        const formElement = document.getElementById('diaper-log-form');
        // Rest both the num selectors and their button toggle state
        this.num1 = false;
        document.getElementById('num1').classList.remove(`clickable-list-item-selected`);
        this.num2 = false;
        document.getElementById('num2').classList.remove(`clickable-list-item-selected`);

        // Reset the delay selector
        document.querySelector('#time-delay-diaper').value = 0;

        // Collapse the form
        formElement.style.display = 'none';
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
    timeDelay;

    constructor() {
        this.childData = new ChildData();
        this.timeDelay = 0;
    }

    toJson() {
        const jsonOut = {
            "datetime": new Date(this.eventDateTime - this.timeDelay * MS_PER_MIN),
            "eventData": this.eventData.toJson(),
            "childData": {
                "householdId": 0,
                "childId": 0
            }
        };

        return jsonOut;
    }

    updateEventText() {
        const jsonOut = this.toJson();
        this.eventData.eventTextBox.textContent = JSON.stringify(jsonOut, null, 2);
    }

    push() {
        // Before we push, update the event time based on the selected delay
        this.eventDateTime = new Date(this.eventDateTime - this.timeDelay * MS_PER_MIN);

        // TODO: Add logic for actually pushing this
        alert(`pushing command ${JSON.stringify(this.toJson())}`);
    }
}

class Feeding {
    constructor() {
        this.typeName = `diaper change`;
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

    toJson() {
        const jsonOut = {

        };
        return jsonOut;
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
const num1Button = document.getElementById('num1');
const num2Button = document.getElementById('num2');


// Static Init
diaperEvent.updateEventText();

// Click handler for Diaper Logging
document.getElementById('diaper-log-button').onclick = function () {
    const element = document.getElementById('diaper-log-form');

    // Toggle between displaying or not displaying form
    if (element.style.display == 'block') {
        element.style.display = 'none';

        // Update Diaper Log button to show that it's no longer active
        document.querySelector('#diaper-log-button').classList.remove('big-button-selected');
    }
    else {
        // Bring up the diaper log entry form
        diaperEvent.eventDateTime = new Date();
        element.style.display = 'block'
        diaperEvent.updateEventText();

        // Update Diaper Log button to show that it's active
        document.querySelector('#diaper-log-button').classList.add('big-button-selected');

        // Close any additional open forms
        document.querySelector('#feeding-log-form').style.display = 'none';

        // Make sure the other form button does not show that it's active
        document.querySelector('#feeding-log-button').classList.remove('big-button-selected');
    }
}

// Click handler for Feeding Logging
document.getElementById('feeding-log-button').onclick = function () {
    const childElement = document.getElementById('feeding-log-form');
    // Toggle between displaying or not displaying form
    if (childElement.style.display == 'block') {
        childElement.style.display = 'none';

        // Make sure the other form button does not show that it's active
        document.querySelector('#feeding-log-button').classList.remove('big-button-selected');
    }
    else {
        // Bring up feeding log entry form
        childElement.style.display = 'block'

        // Update Feeding Log button to show that it's active
        document.querySelector('#feeding-log-button').classList.add('big-button-selected');

        // Close any additional open forms
        document.querySelector('#diaper-log-form').style.display = 'none';

        // Make sure the other form button does not show that it's active
        document.querySelector('#diaper-log-button').classList.remove('big-button-selected');
    }
}

// Click handler for Diaper Log Submit
document.getElementById('diaper-submit-button').onclick = function () {
    // Push the event, then clear out our previous event data
    diaperEvent.push();
    diaperEvent.eventData.reset();
}

// Click handler for Diaper Log Cancel
document.getElementById('diaper-cancel-button').onclick = function () {
    alert(`Cancel it!`);
    diaperEvent.eventData.reset();
}

document.querySelector('#num1').addEventListener('click', event => {
    diaperEvent.eventData.toggleNum1();
    diaperEvent.updateEventText();
});

document.querySelector('#num2').addEventListener('click', event => {
    diaperEvent.eventData.toggleNum2();
    diaperEvent.updateEventText();
});

// Handle change of the delay drop down
document.querySelector('#time-delay-diaper').addEventListener('change', event => {
    diaperEvent.timeDelay = event.target.value;
    diaperEvent.updateEventText();
});


// TODO: refactor this following pattern from diaper logger
function listItemClicked(e) {
    switch (this.id) {
        case 'boob-option': {
            e.target.classList.toggle(`clickable-list-item-selected`);
            boobOptionClickHandler();
            break;
        }
        case 'bottle-option': {
            e.target.classList.toggle(`clickable-list-item-selected`);
            bottleOptionClickHandler();
            break;
        }
        default:
            console.log('unhandled item');
    }
}


function boobOptionClickHandler() {
    // If feeding type is already boob, then we want to 'deselect this?
    feeding.setFeedingTypeBoob();
}

function bottleOptionClickHandler() {
    feeding.setFeedingTypeBottle();
}