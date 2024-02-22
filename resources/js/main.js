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
        this.eventTextBox = document.querySelector('#diaper-event-log-txt');
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
        this.bottleVolume = 0;
        this.leftDuration = 0;
        this.rightDuration = 0;
        this.eventTextBox = document.querySelector('#feeding-event-log-txt');
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

        // Init our durations
        this.leftDuration = document.querySelector('#left-duration-feeding').value;
        this.rightDuration = document.querySelector('#right-duration-feeding').value;
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

        // Init our value
        this.bottleVolume = document.querySelector('#bottle-quant-feeding').value;
    }

    toString() {
        return `feedType = ${this.feedingType}`;
    }

    toJson() {
        let feedingData = {};
        if (this.feedingType == "boob") {
            feedingData = {
                "leftDuration": this.leftDuration,
                "rightDuration": this.rightDuration
            };
        }

        else if (this.feedingType == "bottle") {
            feedingData = {
                "bottleVolume": this.bottleVolume
            };
        }

        else {
            feedingData = {};
        }

        const jsonOut = {
            "feedingType": this.feedingType,
            "feedingData": feedingData
        };
        return jsonOut;
    }

    reset() {
        const formElement = document.getElementById('feeding-log-form');
        // Rest both the num selectors and their button toggle state
        document.querySelector('#boob-option').classList.remove(`clickable-list-item-selected`);
        document.querySelector('#bottle-option').classList.remove(`clickable-list-item-selected`);
        document.querySelector('#left-duration-feeding').value = 0;
        this.leftDuration = 0;
        document.querySelector('#right-duration-feeding').value = 0;
        this.rightDuration = 0;
        document.querySelector('#bottle-quant-feeding').value = 4;
        this.bottleVolume = 0;

        // Collapse the forms
        formElement.style.display = 'none';
        const boobOptionForm = document.querySelector('#boob-options-form');
        boobOptionForm.style.display = 'none';
        const bottleOptionForm = document.querySelector('#bottle-options-form');
        bottleOptionForm.style.display = 'none';
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
const logger = new Logger();

const diaperEvent = new Event();
const diaper = new Diaper();
diaperEvent.eventData = diaper;

const feedingEvent = new Event();
const feeding = new Feeding();
feedingEvent.eventData = feeding;

const num1Button = document.querySelector('#num1');
const num2Button = document.querySelector('num2');


// Static Init
diaperEvent.updateEventText();

// Click handler for Diaper Logging
document.querySelector('#diaper-log-button').onclick = function () {
    const formElement = document.querySelector('#diaper-log-form');

    // Toggle between displaying or not displaying form
    if (formElement.style.display == 'block') {
        formElement.style.display = 'none';

        // Update Diaper Log button to show that it's no longer active
        document.querySelector('#diaper-log-button').classList.remove('big-button-selected');
    }
    else {
        // Bring up the diaper log entry form
        diaperEvent.eventDateTime = new Date();
        formElement.style.display = 'block'
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
document.querySelector('#feeding-log-button').onclick = function () {
    const childElement = document.querySelector('#feeding-log-form');
    // Toggle between displaying or not displaying form
    if (childElement.style.display == 'block') {
        childElement.style.display = 'none';

        // Make sure the other form button does not show that it's active
        document.querySelector('#feeding-log-button').classList.remove('big-button-selected');
    }
    else {
        // Bring up feeding log entry form
        feedingEvent.eventDateTime = new Date();
        childElement.style.display = 'block'
        feedingEvent.updateEventText();

        // Update Feeding Log button to show that it's active
        document.querySelector('#feeding-log-button').classList.add('big-button-selected');

        // Close any additional open forms
        document.querySelector('#diaper-log-form').style.display = 'none';

        // Make sure the other form button does not show that it's active
        document.querySelector('#diaper-log-button').classList.remove('big-button-selected');
    }
}

// Click handler for Diaper Log Submit
document.querySelector('#diaper-submit-button').onclick = function () {
    // Push the event, then clear out our previous event data
    diaperEvent.push();
    diaperEvent.eventData.reset();
}

// Click handler for Diaper Log Cancel
document.querySelector('#diaper-cancel-button').onclick = function () {
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


document.querySelector('#boob-option').addEventListener('click', event => {
    event.target.classList.toggle(`clickable-list-item-selected`);
    boobOptionClickHandler();
});

document.querySelector('#bottle-option').addEventListener('click', event => {
    event.target.classList.toggle(`clickable-list-item-selected`);
    bottleOptionClickHandler();
});

document.querySelector('#left-duration-feeding').addEventListener('change', event => {
    feedingEvent.eventData.leftDuration = event.target.value;
    feedingEvent.updateEventText();
});

document.querySelector('#right-duration-feeding').addEventListener('change', event => {
    feedingEvent.eventData.rightDuration = event.target.value;
    feedingEvent.updateEventText();
});

document.querySelector('#bottle-quant-feeding').addEventListener('change', event => {
    feedingEvent.eventData.bottleVolume = event.target.value;
    feedingEvent.updateEventText();
});

// Click handler for Diaper Log Submit
document.querySelector('#feeding-submit-button').onclick = function () {
    // Push the event, then clear out our previous event data
    feedingEvent.push();
    feedingEvent.eventData.reset();
}

// Click handler for Diaper Log Cancel
document.querySelector('#feeding-cancel-button').onclick = function () {
    alert(`Cancel it!`);
    feedingEvent.eventData.reset();
}

function boobOptionClickHandler() {
    // If feeding type is already boob, then we want to 'deselect this?
    feeding.setFeedingTypeBoob();
    feedingEvent.updateEventText();
}

function bottleOptionClickHandler() {
    feeding.setFeedingTypeBottle();
    feedingEvent.updateEventText();
}