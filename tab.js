class SetTab {
    /**
     * 汎用タブ
     * @constructor
     * @param {object} root タブ要素
     * @type {object} list ul要素
     * @type {object} hook タブ切替のhookになるa要素
     * @type {object} content タブitemのラッパー要素
     * @type {object} item タブの各表示要素
     * @type {number} hookLength タブリストの総数
     */
    constructor(root) {
        if (!root) {
            return;
        }

        this.root = root;
        this.list = this.root.querySelector('.js-tab-box__list');
        this.listItem = this.list.querySelectorAll('li');
        this.hook = this.root.querySelectorAll('.js-tab-box__hook');
        this.content = this.root.querySelector('.js-tab-box__content');
        this.item = this.root.querySelectorAll('.js-tab-box__item');
        this.hookLength = this.hook.length;

        this.setA11y();
        this.setClickEvent();
        this.setKeyEvent();
    }

    /*
     * aria,role属性の付与
     */
    setA11y() {
        this.list.setAttribute('role', 'tablist');

        this.listItem.forEach((element) => {
            element.setAttribute('role', 'presentation');
        });

        this.hook.forEach((element, index) => {
            element.setAttribute('aria-controls', element.getAttribute('href').replace('#', ''));
            element.setAttribute('role', 'tab');

            if (!index) {
                element.setAttribute('aria-selected', 'true');

                return;
            }

            element.tabIndex = -1;
        });

        this.item.forEach((element, index) => {
            element.setAttribute('role', 'tabpanel');

            if (index) {
                element.hidden = true;
            }
        });
    }

    /**
     * tabhookの表示切替
     * @param {object} element 押下されたhook要素
     * @returns {void}
     */
    changeHookState(element) {
        this.hook.forEach((element2) => {
            element2.removeAttribute('aria-selected');
            element2.tabIndex = -1;
        });

        element.setAttribute('aria-selected', 'true');
        element.tabIndex = '';
    }

    /**
     * tabitemの表示切替
     * @param {eventObject} e クリックイベントオブジェクト
     * @returns {void}
     */
    changeItemState(e) {
        this.item.forEach((element) => {
            element.hidden = '';

            if (!e.currentTarget.getAttribute('aria-controls').includes(element.id)) {
                element.hidden = true;
            }
        });
    }

    /*
     * clickイベントの登録
     */
    setClickEvent() {
        this.hook.forEach((element) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();

                this.changeHookState(element);
                this.changeItemState(e);
            });
        });
    }

    /**
     * 十字キー操作による次へのタブ移動
     * @param {number} activeCount アクティブになっているタブの値
     * @returns {void}
     */
    nextTab(activeCount) {
        if (activeCount === this.hookLength) {
            this.hook[0].focus();

            return;
        }
        this.hook[activeCount].focus();
    }

    /**
     * 十字キー操作による前へのタブ移動
     * @param {number} activeCount アクティブになっているタブの値
     * @returns {void}
     */
    prevTab(activeCount) {
        if (activeCount === 1) {
            this.hook[this.hookLength - 1].focus();

            return;
        }
        this.hook[activeCount - 2].focus();
    }

    /**
     * 十字キー操作のイベントハンドラ
     * @param {eventObject} e キーボードイベントオブジェクト
     * @returns {void}
     */
    keyHandler(e) {
        let focusCount = 1;

        for (let i = 0; i < this.hookLength; i++) {
            if (this.hook[i].matches(':focus')) {
                break;
            }
            focusCount++;
        }

        switch (e.key) {
        case 'ArrowRight':
        case 'Right':
            this.nextTab(focusCount);
            break;

        case 'ArrowLeft':
        case 'Left':
            this.prevTab(focusCount);
            break;

        default:
            break;
        }
    }

    /*
     * keyイベントの登録
     */
    setKeyEvent() {
        this.hook.forEach((element) => {
            element.addEventListener('keydown', (e) => {
                this.keyHandler(e);
            });
        });
    }
}

export default function setTab() {
    document.querySelectorAll('.js-tab-box').forEach((element) => new SetTab(element));
}
