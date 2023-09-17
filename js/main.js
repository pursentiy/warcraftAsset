$(document).ready(function () {

    $('body').scrollTop(0);

    $('.button_toggle').on('click', function () {
        $('.sidebar').toggleClass('scroll');
        $('.wrapper').toggleClass('wrapper_small');
    });

    $('.owl-carousel').owlCarousel({
        loop: true,
        items: 1,
        center: true,
        margin: 100,
        nav: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            // breakpoint from 0 up
            1000: {
                items: 1
            }
        }
    });

    let clickedLink = false;
    $(".sidebar").on("click", "div", function (event) {
        if (clickedLink) return;
        GetGamesDivPos(games);
        event.preventDefault();
        const ids = $(this).attr('class');
        ScrollDisplayToGame(ids)
    });

    function ScrollDisplayToGame(ids) {
        if (ids.length >= 25) {
            const id = ids.split(" ");
            var gameBlock = document.getElementById(id[0].slice(1)).getBoundingClientRect();
            clickedLink = true;
            $('body,html').animate({ scrollTop: GetScroll(gameBlock.top), }, 1000);
            setTimeout(function () {
                clickedLink = false;
                SetSideBarGame(document.documentElement.scrollTop)
            }, 1000);
        }
    }


    function GetScroll(amount) {
        let displayScroll = document.documentElement.scrollTop;
        displayScroll += amount;
        if (displayScroll < 0) displayScroll = 0;
        return displayScroll;
    }

    $(window).resize(function () {
        setTimeout(function () { settingCss() }, 1000);
    });

    var gamePosArr = [];
    var gameHeightArr = [];
    var currentScrollPosition = $(window).scrollTop();

    const sideBarGames = [];
    const games = document.getElementsByClassName("game");


    function GetGamesDivPos(gamesDiv) {
        gamePosArr.length = 0;
        for (let i = 0; i < gamesDiv.length; i++) {
            let gamePos = $(gamesDiv[i]).position();
            gameHeightArr.push(gamesDiv[i].clientHeight);
            console.log("Game " + i + ", position is: " + gamePos.top, ", height is: " + $(gamesDiv[i]).height());
            gamePosArr.push(gamePos.top);
        }
    }

    function GetSidebarGames(sidGames) {
        for (let i = 0; i < sidGames.length; i++) {
            sideBarGames.push(sidGames[i]);
        }
    }

    const sidebarGames = document.getElementsByClassName("sidebarGame")

    function SetSideBarGame(offset) {
        let focusHeight = $(window).height() * 3 / 4;
        console.log("Offset is" + offset);
        let gameIndex = GetSidebarIndex(currentScrollPosition, focusHeight);
        console.log("Current index is :" + gameIndex);


        if (currentScrollPosition < gamePosArr[0] - gameHeightArr[0] / 2) {
            removeActiveClassSidebarGames();
            return;
        }

        //height and index
        let nextSectionParameters = GetNextGameParameters(gameIndex);
        if (scrollingDown) {
            if ((currentScrollPosition) > gamePosArr[gameIndex]) {
                ActivateGameSection(gameIndex);
            }
            else if ((currentScrollPosition + focusHeight) > nextSectionParameters[0]) {
                ActivateGameSection(gameIndex);
            }
        }
        else {
            if ((currentScrollPosition) > nextSectionParameters[0]) {
                ActivateGameSection(gameIndex);
            }
        }
    }

    let scrollingDown = true;
    function GetNextGameParameters(currentGameIndex) {
        if (currentGameIndex == undefined) {
            return [gamePosArr[0], 0];
        }
        else if (scrollingDown) {
            if (currentGameIndex + 1 >= gamePosArr.length - 1) {
                return [gamePosArr[currentGameIndex], currentGameIndex];
            }
            else {
                return [gamePosArr[currentGameIndex] + gameHeightArr[currentGameIndex]* 1 / 4, currentGameIndex];
            }
        }
        else {
            if (currentGameIndex - 1 <= 0) {
                return [gamePosArr[currentGameIndex], currentGameIndex];
            }
            else {
                return [gamePosArr[currentGameIndex - 1] + gameHeightArr[currentGameIndex - 1] / 2, currentGameIndex - 1];
            }
        }

    }

    function ActivateGameSection(gameIndex) {
        if (gameIndex != null && !sideBarGames[gameIndex].classList.contains("activeSidebar")) {
            removeActiveClassSidebarGames();
            sideBarGames[gameIndex].classList.add("activeSidebar");
        }
    }

    function GetSidebarIndex(pageYOffset, focusHeight) {
        if (scrollingDown) {
            for (let i = gamePosArr.length; i >= 0; i--) {
                if (pageYOffset >= gamePosArr[i]) return i
                if (pageYOffset + focusHeight >= gamePosArr[i] + gameHeightArr[i] * 1 / 4) {
                    return i;
                }
            }
        }
        else {
            for (let i = gamePosArr.length; i >= 0; i--) {
                if (pageYOffset >= gamePosArr[i] - gameHeightArr[i]/4) {
                    return i;
                }
            }
        }
    }

    function removeActiveClassSidebarGames() {
        for (let i = 0; i < sideBarGames.length; i++) {
            sideBarGames[i].classList.remove("activeSidebar");
        }
    }




    $(window).load(function () {
        GetSidebarGames(sidebarGames);
        GetGamesDivPos(games);
        SetSideBarGame(window.pageYOffset);
    });


    window.onscroll = function () {
        let scroll = $(window).scrollTop() + 25;
        if (currentScrollPosition > scroll) {
            //this.console.log("Up")
            scrollingDown = false;
        }
        else {
            //this.console.log("Down")
            scrollingDown = true;
        }
        SetSideBarGame(document.documentElement.scrollTop);
        currentScrollPosition = scroll;
        console.log(currentScrollPosition);
    }

    $(window).resize(function () {
        gamePosArr.length = 0;
        gameHeightArr.length = 0;
        GetGamesDivPos(games);
        SetSideBarGame($(document).scrollTop());
    });

    $(window).on('beforeunload', function () {
        $('body').hide();
        $(window).scrollTop(0);
    });

});


