class Navigator {
    locationsJsonPath;
    extraURL;
    mainPageUrl;
    brand;
    topDistance;
    navbarToggle;

    locations;
    currentURL;
    mainContainer;

    constructor(brand, locationsJsonPath, mainPageUrl = 'main', extraURL = '', navbarElement = null, navbarToggle = null) {
        this.brand = brand;
        this.locationsJsonPath = locationsJsonPath;
        this.mainPageUrl = mainPageUrl;
        this.extraURL = extraURL;
        this.topDistance = (navbarElement == null) ? 0 : navbarElement.offsetHeight;
        this.navbarToggle = navbarToggle;
    }

    firstSetUp = async () => {
        this.locations = await this.makeRequest(this.locationsJsonPath, 'json');
        
        const urlText = this.getUrlText();
        this.currentURL = (this.locations[urlText] == undefined) ? this.mainPageUrl : urlText;

        this.mainContainer = document.getElementById('mainContainer');
        this.setHistory();
        await this.loadNextLocation();

        window.onpopstate = this.historyNavEvent;
    }

    makeRequest = async (url, type) => {
        let respond = await fetch(url);
        let result = null;
        if(type == 'text') {
            result = await respond.text();
        } else if(type == 'json') {
            result = await respond.json();
        }
        return result;
    }

    getUrlText = () => {
        return location.pathname.replace(this.extraURL, '');
    }

    linkClickEvent = (e) => {
        e.preventDefault();
        let newURL = (e.target.classList.contains('non-link-referer')) ? e.target.getAttribute('refer-to') : e.target.getAttribute('href');
        this.handleUrl(newURL);
    }

    scrollToNewPos = (newPosText) => {
        let newPos = 0;
        if(newPosText != 'top') {
            const repeat = setInterval(()=>{
                if(document.getElementById(newPosText) != null) {
                    clearInterval(repeat);
                    newPos = document.getElementById(newPosText).offsetTop - this.topDistance;
                    window.scrollTo(0, newPos);
                }
            },100);
        } else {
            window.scrollTo(0, newPos);
        }
    }

    setTitle = () => {
        const titleAdd = this.locations[this.currentURL].titleAddition;
        document.title = (titleAdd.length > 0) ? titleAdd+' - '+this.brand : this.brand;
    }

    handleUrl = async (newURL) => {
        if(newURL == undefined || newURL == null) {
            newURL = this.mainPageUrl;
        }
        if(newURL != this.currentURL) {
            if(this.locations[newURL].path != this.locations[this.currentURL].path) {
                this.currentURL = (this.locations[newURL] == undefined) ? this.mainPageUrl : newURL;
                this.setHistory();
                await this.loadNextLocation();
            } else {
                this.currentURL = (this.locations[newURL] == undefined) ? this.mainPageUrl : newURL;
                this.setHistory();
                this.setTitle();
                this.scrollToNewPos(this.locations[this.currentURL].position);
            }
        } else {
            this.scrollToNewPos(this.locations[this.currentURL].position);
        }
        if(this.navbarToggle != null) {
            if(document.getElementById('navbarNav').classList.contains('show')) {
                document.getElementsByClassName('navbar-toggler')[0].click();
            }
        }
    }

    historyNavEvent = async () => {
        let newURL = this.getUrlText();
        if(newURL != this.currentURL) {
            if(this.locations[newURL].path != this.locations[this.currentURL].path) {
                this.currentURL = (this.locations[newURL] == undefined) ? this.mainPageUrl : newURL;
                await this.loadNextLocation();
            } else {
                this.currentURL = (this.locations[newURL] == undefined) ? this.mainPageUrl : newURL;
                this.setTitle();
                this.scrollToNewPos(this.locations[this.currentURL].position);
            }
        } else {
            this.scrollToNewPos(this.locations[this.currentURL].position);
        }
    }

    openNewPage = (e) => {
        const url = e.target.getAttribute('open-url');
        if(url != null && url != undefined) {
            window.open(url, '_blank').focus();
        }
    }

    setHistory = () => {
        window.history.pushState({"pageTitle":document.title, "title":document.title}, document.title, this.currentURL);
    }

    setLinks = () => {
        const hyperLinkElements = document.querySelectorAll('a, .non-link-referer');
        for(let element of hyperLinkElements) {
            element.onclick = this.linkClickEvent;
        }
        
        const newPageOpeners = document.getElementsByClassName('new-page-opener');
        for(let element of newPageOpeners) {
            element.onclick = this.openNewPage;
        }
    }

    loadNextLocation = async () => {
        this.setTitle();

        const htmlContent = await this.makeRequest(this.locations[this.currentURL].path, 'text');
        this.mainContainer.innerHTML = htmlContent;

        this.scrollToNewPos(this.locations[this.currentURL].position);

        this.setLinks();
    }

}

const navigator = new Navigator(
    'Navigator',
    './json/locations.json',
    'main',
    '/Demo/',
    document.getElementsByTagName('nav')[0],
    document.getElementsByClassName('navbar-toggler')[0]
);
navigator.firstSetUp();