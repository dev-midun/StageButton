class StageButton {
    #_element;
    #_listButton;
    #_event;
    #_color;
    #_class = {
        stages: 'stage-list',
        button: 'stage-button',
        notActive: 'stage-is-not-active',
        before: 'stage-is-before',
        done: 'stage-is-done'
    };
    #_status = {
        done: 'is-done',
        active: 'is-active'
    };

    constructor({
        element,
        listButton = [],
        color = StageButton.Default,
        event = () => {}
    }) {
        this.element = element;
        this.color = color;
        this.listButton = listButton;
        this.event = event;

        this.init();
    }
    
    static get Default() {
        return 'color-is-default';
    }

    static get Blue() {
        return 'color-is-blue';
    }

    static get Green() {
        return 'color-is-green';
    }

    static get Red() {
        return 'color-is-red';
    }

    static get Yellow() {
        return 'color-is-yellow';
    }

    set color(value) {
        const isColorsExists = [
            StageButton.Default, StageButton.Blue, StageButton.Green, 
            StageButton.Red, StageButton.Yellow
        ].filter(item => item == value).length > 0 ? true : false;

        this.#_color = isColorsExists ? value : StageButton.Default;
    }

    set element(value) {
        if(typeof value == 'string') {
            this.#_element = document.querySelector(value);
        } else if(typeof value == 'object' && value && value.nodeType) {
            this.#_element = value;
        } else {
            throw new Error('Element must be string or object element');
        }

        this.#_element.classList.toggle(this.#_class.stages, true);
    }

    set listButton(value) {
        if(typeof value == 'object' && value && value.length > 0) {
            this.#_listButton = value;
        } else {
            throw new Error('List button must be array and cannot empty');
        }
    }

    set event(value) {
        if(value != undefined && typeof value == 'function') {
            this.#_event = value;
        } else {
            this.#_event = null;
        }
    }
    
    init() {
        try {
            this.#renderButton();   
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    
    #renderButton() {
        this.#_listButton.forEach(item => {
            const button = document.createElement('button');
            const isListButtonObject = item && typeof item == 'object' ? true : false;

            button.setAttribute('class', `${this.#_class.button} ${this.#_class.notActive} ${this.#_color}`);
            button.style.outline = '0px';

            if(isListButtonObject && item.color && typeof item.color == 'string') {
                button.style.h
            }

            button.innerHTML = isListButtonObject ? item.name : item;
            this.#_element.appendChild(button);

            button.addEventListener('click', e => {
                this.#onClickStage(e.target, item, isListButtonObject);
            });

            button.addEventListener('mouseover', e => {
                this.#onMouseOverStage(e.target);
            });

            button.addEventListener('mouseout', e => {
                this.#onMouseOutStage(e.target);
            });
        });
    }

    #onClickStage(button, stage, isStageObject) {
        button.classList.remove(this.#_class.notActive, this.#_class.before);
        button.classList.toggle(this.#_class.done, true);
        button.style.cursor = 'not-allowed';

        button.classList.toggle(this.#_status.active, true);
        button.classList.toggle(this.#_status.done, true);

        let btn = button;
        while(btn.previousElementSibling ? true : false) {
            btn.previousElementSibling.classList.remove(this.#_class.before, this.#_status.active);
            btn.previousElementSibling.classList.toggle(this.#_class.done, true);
            btn.previousElementSibling.classList.toggle(this.#_status.done, true);
            btn.previousElementSibling.style.cursor = 'pointer';
            btn = btn.previousElementSibling;
        }
        
        btn = button;
        while(btn.nextElementSibling ? true : false) {
            btn.nextElementSibling.classList.remove(this.#_status.active, this.#_status.done, this.#_class.done, this.#_class.before);
            btn.nextElementSibling.classList.toggle(this.#_class.notActive, true);
            btn.nextElementSibling.style.cursor = 'pointer';
            btn = btn.nextElementSibling;
        }

        if(isStageObject && stage.event != undefined && typeof stage.event == 'function') {
            stage.event(stage.name);
        } else if(this.#_event != null) {
            this.#_event(stage);
        }
    }

    #onMouseOverStage(button) {
        let scope = button;
        while(scope.previousElementSibling ? true : false) {
            if(!scope.previousElementSibling.classList.contains(this.#_status.active)) {
                scope.previousElementSibling.classList.remove(this.#_class.notActive);
                if(!scope.previousElementSibling.classList.contains(this.#_status.done)) {
                    scope.previousElementSibling.classList.toggle(this.#_class.before, true);
                }
            }
            
            scope = scope.previousElementSibling;
        }

        scope = button;
        while(scope.nextElementSibling ? true : false) {
            if(scope.nextElementSibling.classList.contains(this.#_status.done)) {
                scope.nextElementSibling.classList.remove(this.#_class.done);
                scope.nextElementSibling.classList.toggle(this.#_class.before, true);
            }

            scope = scope.nextElementSibling;
        }
    }

    #onMouseOutStage(button) {
        let scope = button;
        while(scope.previousElementSibling ? true : false) {
            if(!scope.previousElementSibling.classList.contains(this.#_status.active)) {
                scope.previousElementSibling.classList.remove(this.#_class.before);
                if(!scope.previousElementSibling.classList.contains(this.#_status.done)) {
                    scope.previousElementSibling.classList.toggle(this.#_class.notActive, true);
                }
            }

            scope = scope.previousElementSibling;
        }

        while(scope.nextElementSibling ? true : false) {
            if(scope.nextElementSibling.classList.contains(this.#_status.done)) {
                scope.nextElementSibling.classList.remove(this.#_class.before);
                scope.nextElementSibling.classList.toggle(this.#_class.done, true);
            }

            scope = scope.nextElementSibling;
        }
    }

    getActiveStage() {
        // return this.#_element.querySelector('.is-active')
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const stageButton = new StageButton({
        element: '#stage-button',
        listButton: [
            'Stage 1', 
            {
                name: 'Stage 2',
                event: (stage) => {
                    console.log('Ini Button Stage khusus', stage);
                }
            }, 
            'Stage 3', 
            'Stage 4'
        ],
        color: StageButton.Green,
        event: (stage) => onOpportunityStageClick(stage)
    })
});

function onOpportunityStageClick(stage) {
    setTimeout(() => {
        console.log('Proses Finish');    
    }, 2000);

    console.log('Proses Mulai');
    if(stage == 'Stage 1') {
        console.log('Sia kehed beul 1');
    } else if(stage == 'Stage 2') {
        console.log('Sia kehed beul 2');
    } else {
        console.log('Sia kehed beul 3, 4, 5');
    }
}