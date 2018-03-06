$(function() {
    var Breakpoints = {
        maxMobile: '480',
        maxTabletLandscape: '1024'
    };

    var Website = {
        init: function() {
            this.detectElements();
            this.bindEvents();
            this.screenCheckThing();
        },
        detectElements: function() {
            this.$htmlBody = $('html,body');
            this.$overlay = $('.overlay');
            this.$elevatorUpBtn = $('.btn--elevator-pitch');
            this.$triggerEl = $('[data-jumpto]');
            this.$trapBtn = $('.js-trigger-trap');
            this.$triggerAudioBtn = $('.js-trigger-sound');
            this.$audioElements = $('audio');
            this.$timeLeft = $('.time-left');

            this.screenSize = window.innerWidth;
            this.jumpSpeed = 500;
            this.endOfPage = $(document).height() - $(window).height();


        },
        bindEvents: function() {
            this.$elevatorUpBtn.on('click', this.elevatorThing.bind(this));
            this.$triggerEl.on('click', this.jumpToX);
            this.$triggerAudioBtn.on('mouseenter touchstart', this.audioMouseEnterThing);
            this.$triggerAudioBtn.on('mouseleave', this.audioMouseLeaveThing.bind(this));
        },
        screenCheckThing: function() {
            if (this.screenSize > Breakpoints.maxTabletLandscape) {
                this.gifHoverThing();
                this.gameThing();
            }

            if (this.screenSize <= Breakpoints.maxTabletLandscape) {
                this.jumpSpeed = 250;
            }

            this.jumpToEnd();
            this.nsfwTrapThing();
        },
        elevatorThing: function() {
            var oneMinuteInMs = 30000,
                oneMinuteInSec = 30;

            this.$htmlBody.animate({
                    scrollTop: 0
                },
                oneMinuteInMs,
                function() {
                    $('#sound-ding')[0].play();
                }
            );

            var counter = oneMinuteInSec,
                interval = setInterval(function() {
                    counter--;

                    this.$timeLeft.text(counter);

                    if (counter <= 10) {
                        this.$timeLeft.css('color', 'red');
                    }

                    if (counter === 0) {
                        this.$timeLeft.text('');
                        clearInterval(interval);
                    }
                }, 1000);
        },
        jumpToEnd: function() {
            this.$htmlBody.animate({
                    scrollTop: this.endOfPage
                },
                this.jumpSpeed,
                function() {
                    Website.hideOverlay();
                }
            );
        },
        jumpToX: function() {
            var $targetElData = $(this).data('jumpto'),
            $targetEl = $("#" + $targetElData);

            Website.$htmlBody.animate({
                    scrollTop: $targetEl.offset().top - 50
                },
                this.jumpSpeed,
                function() {
                    //$('#sound-ding')[0].play();
                }
            );

            return false;
        },
        gifHoverThing: function() {
            var $triggerGifBtn = $(".js-trigger-gif"),
                defaultImage = "url(images/coding.gif)";

            $triggerGifBtn.on("mouseenter touchstart", function() {
                var dataGif = $(this).data('gif'),
                    $mediaEl = $(this).parents('.article__main').find('.side-gif');

                $($mediaEl).css("background-image", "url(images/" + dataGif + ".gif)");
            }).on("mouseleave", function() {
                var $mediaEl = $(this).parents('.article__main').find('.side-gif');

                $mediaEl.css("background-image", defaultImage);
            });
        },
        audioMouseEnterThing: function() {
            //var $triggerAudioBtn = $('.js-trigger-sound'),
                //audioElements = $('audio');

            // this.$triggerAudioBtn.on("mouseenter touchstart", function() {
            //     var dataSound = $(this).data('sound');
            //     $('#sound-' + dataSound)[0].play();
            // }).on("mouseleave", function() {
            //     Website.audioElements.each(function() {
            //         this.pause();
            //         this.currentTime = 0;
            //     });
            // });

            var dataSound = $(this).data('sound');
            $('#sound-' + dataSound)[0].play();

        },
        audioMouseLeaveThing: function() {
            this.$audioElements.each(function() {
                this.pause();
                this.currentTime = 0;
            });
        },
        gameThing: function() {
            $('.game').blockrain({ autoplayRestart: true, theme: 'modern' });
        },
        nsfwTrapThing: function() {
            var trapImgClass = 'nsfw__trap-image';

            this.$trapBtn.on("mouseenter touchstart", function() {
                $(this).addClass(trapImgClass);
            }).on("mouseleave", function() {
                $(this).removeClass(trapImgClass);
            });
        },
        hideOverlay: function() {
            this.$overlay.hide();
        }
    };

    Website.init();
});