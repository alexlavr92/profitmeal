$(document).ready(function () {

    // Определение ширины документа //
    var DocWidth = $(document).width()
    /*  console.log(DocWidth) */

    /* Функция блокировки скрола при раскрытии модального окна с задежкой по времени */
    var blockScroll = function (state) {
        if (state == "open") {
            setTimeout(function () {

                if (!document.body.hasAttribute('data-body-scroll-fix')) {

                    let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

                    document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.top = '-' + scrollPosition + 'px';
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                }

            }, 10);
        }
        if (state == "close") {
            if (document.body.hasAttribute('data-body-scroll-fix')) {

                let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

                document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';

                window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение

            }
        }
    }
    //----------------------//


    // Инициализация плагина select2 для стилизации дефолтных селектов //
    //Указываем язык локализации плагина
    var lang = 'ru'

    function select_style(w) {
        if ($('.default-select:not(.default-select-street)').length > 0) {
            $('.default-select:not(.default-select-street)').select2({
                minimumResultsForSearch: Infinity,
                theme: 'custom-select',
                language: lang,
                selectOnClose: true,
            });
        }
        if ($('.default-select.default-select-street').length > 0) {
            $('.default-select.default-select-street').select2({
                minimumResultsForSearch: 0,
                theme: 'custom-select',
                language: lang,
                selectOnClose: true,
            });
        }
        if (w < 1200) {
            $('.default-select:not(.header_language-select)').select2('destroy')
        }
    }

    select_style(DocWidth)

    // Добавление класса в раскрытый select //
    $('.default-select').on('select2:open', function (event) {
        $('.select2-container.select2-container--custom-select:not(.select2)')
            .removeClass('select2-custom')
            .removeClass('select2-header')
            .removeClass('select2-address')
            .css({ 'font-size': '' })
        if ($(this).hasClass('header_language-select')) {
            $('.select2-container.select2-container--custom-select:not(.select2)').addClass('select2-header')
        }
        if ($(this).hasClass('default-select') && !$(this).hasClass('header_language-select'))
            $('.select2-container.select2-container--custom-select:not(.select2)').addClass('select2-custom')
        if ($(this).hasClass('default-select') && $(this).hasClass('address-select'))
            $('.select2-container.select2-container--custom-select:not(.select2)').addClass('select2-address')
        if ($(this).hasClass('default-select_edit') && $(this).hasClass('default-select'))
            $('.select2-container.select2-container--custom-select:not(.select2)').css({ 'font-size': '14px' })

    })
    //----------------------//


    // Инициализация модальных окон //
    $('body').on('click', '.modal-open', function (e) {
        e.preventDefault()
        var ThisHash
        if ($(this).attr('href') !== undefined)
            ThisHash = $(this).attr('href')
        blockScroll('open')
        if (ThisHash == "#menu_add-modal") {
            $('.form-menu_add-modal').find('.menu-add_features_img img').attr('src', $(this).attr('image'))
            $('.form-menu_add-modal').find('.menu-add_features_name').text($(this).attr('order_name'))
            $('.form-menu_add-modal').find('.menu-add_features_kkal span').text($(this).attr('callories'))
            $('.form-menu_add-modal').attr('price', $(this).attr('price'))
            var ThisPrice = parseInt($(this).attr('price'))
            var MenuAddTabs = $('.form-menu_add-modal .menu-add_tabs-item')
            MenuAddTabs.each(function (index, elem) {
                if ($(elem).attr('discount') != '0') {
                    var Discount = ThisPrice * parseInt($(elem).attr('days')) / 100 * parseInt($(elem).attr('discount'))
                    $(elem).find('.discount span').text(Discount)
                }
                else {
                    $(elem).find('.discount span').text('0')
                }
                if ($(elem).hasClass('active')) {
                    $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_profit > span:last-child')
                        .text(ThisPrice * parseInt($(elem).attr('days')) / 100 * parseInt($(elem).attr('discount')))
                    var PriceNoDiscount = ThisPrice * parseInt($(this).attr('days'))
                    if ($(elem).attr('discount') == '0') {
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_discount .big-price').text(PriceNoDiscount)
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount').addClass('hide')
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount .big-price').text('')
                    }
                    else {
                        var PriceDiscount = (ThisPrice * parseInt($(elem).attr('days'))) - (ThisPrice * parseInt($(elem).attr('days')) / 100 * parseInt($(elem).attr('discount')))
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_discount .big-price').text(PriceDiscount)
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount .big-price').text(PriceNoDiscount)
                        $(elem).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount').removeClass('hide')

                    }
                }
            })
        }
        $(ThisHash).modal({
            fadeDuration: 150,
            closeClass: 'close-custom',
            closeText: '<span class="visually-hidden">Закрыть</span>'
        })
    })
    $('.private-modal.modal').on('modal:open', function (event, modal) {
        $('.jquery-modal').addClass('private')
    })
    $('.modal').on('modal:close', function (event, modal) {
        blockScroll('close')
    })

    // Удаление класса невалидных полей и очистка данных в форме добавления адреса после её закрытия //
    $('.modal').on('modal:after-close', function (event, modal) {
        $(this).find('.invalid').removeClass('invalid')
        /*  if ($(this).hasClass('address-modal')) {
             $(this).find('input').val('')
             $(this).find('input[type="checkbox"]').prop('checked', false)
             $(this).find('select').val('').trigger('change')
         } */
    })
    //----------------------//

    // Инициализация маски телефона //
    function initPhoneMask() {
        if ($('.default-input.phone').length > 0) {
            /*             if ($('.default-input.phone').hasClass('ru')) { */
            $('.default-input.phone').attr('placeholder', '+380  Введите номер телефона')
            $(".default-input.phone").inputmask({
                mask: "+380  99-999-99-99"
            });
            /*     } */
            /*             if ($('.default-input.phone').hasClass('ua')) {
                            $('.default-input.phone').attr('placeholder', '+380  Введите номер телефона')
                            $(".default-input.phone").inputmask({
                                mask: "+380  99-999-99-99",
                                showMaskOnHover: false
                            });
                        } */
        }
    }
    initPhoneMask()
    //----------------------//

    // Инициализация маски телефона //
    function initPrivateCodeMask() {
        if ($('.default-input.code').length > 0) {
            $(".default-input.code").inputmask({
                mask: "9999",
                /* showMaskOnHover: false */
            });
        }
    }
    initPrivateCodeMask()
    //----------------------//

    // Инициализация маски ввода цифр //
    function initPrivateNumberMask() {
        if ($('.default-input.number').length > 0) {
            $(".default-input.number").inputmask({
                /* mask: "9", */
                regex: "[0-9]*",
                /* repeat: "10", */
                /* showMaskOnHover: false */
            });
        }
    }
    initPrivateNumberMask()
    //----------------------//


    // Инициализация маски ввода текста //
    function initPrivateTextMask() {
        if ($('.default-input.text').length > 0) {
            $(".default-input.text").inputmask({
                regex: "[a-zA-Zа-яА-Я]*",
                /* showMaskOnHover: false */
            });
        }
    }
    initPrivateTextMask()
    //----------------------//

    // Инициализация маски email //
    function initEmailMask() {
        if ($('.default-input.email').length > 0) {
            $(".default-input.email").inputmask("email")
        }
    }
    initEmailMask()
    //----------------------//

    // Функционал изменения маски ввода телефона при изменении языка сайта //
    /*    $('body').on('change', '.header_language-select', function (e) {
           var AllPhoneInput = $('.default-input.phone')
           if ($(this).val() == "RU") {
               AllPhoneInput.each(function (i, elem) {
                   if ($(elem).hasClass('ua')) {
                       $(elem).removeClass('ua').addClass('ru').val('')
                   }
               })
               initPhoneMask()
           }
           if ($(this).val() == "UA") {
               AllPhoneInput.each(function (i, elem) {
                   if ($(elem).hasClass('ru')) {
                       $(elem).removeClass('ru').addClass('ua').val('')
                   }
               })
               initPhoneMask()
           }
           if ($('.private-modal_form').length > 0) {
               $('.private-modal_form .show').removeClass('show').addClass('hide')
               $('.private-modal_form .btn.send').removeClass('send').text('получить код')
               $('.private-modal_form .default-input').removeClass('invalid').val('')
           }
       }) */
    //----------------------// 

    // Валидация форм в модальных окнах //
    $('body').on('submit', '.modal_form', function (e) {
        if ($(this).find('.default-input.phone').length > 0
            && (!$(this).find('.default-input.phone').inputmask('isComplete') || $(this).find('.default-input.phone').val() == '')) {
            $(this).find('.default-input.phone').addClass('invalid')
        }

        if ($(this).find('.invalid').length == 0) {
            if ($(this).hasClass('private-modal_form')) {
                if (!$(this).find('.submit_wrapper .btn').hasClass('send')) {
                    $(this).find('.hide').fadeIn().removeClass('hide').addClass('show')
                    if ($(this).find('.submit_wrapper .add-phone').length > 0) {
                        $(this).find('.submit_wrapper .btn').text('Добавить')
                    }
                    else $(this).find('.submit_wrapper .btn').text('Войти')
                    $(this).find('.submit_wrapper .btn').addClass('send')
                }
                else if ($(this).find('.submit_wrapper .btn').hasClass('send')) {
                    if ($(this).find('.default-input.code').length > 0
                        && (!$(this).find('.default-input.code').inputmask('isComplete') || $(this).find('.default-input.code').val() == '')) {
                        $(this).find('.default-input.code').addClass('invalid')
                    }
                    if ($(this).find('.invalid').length == 0) {
                        // Тут можно разместить код обработки формы по ajax //
                        console.log('Валидация пройдена')
                    }
                }
            }
            if ($(this).hasClass('form-menu_add-modal')) {
                if (!$(this).find('.submit_wrapper .btn').hasClass('send')) {
                    $(this).find('.default-input_wrapper.hide').fadeIn().removeClass('hide').addClass('show')
                    $(this).find('.submit_wrapper .btn').text('Сделать заказ')
                    $(this).find('.submit_wrapper .btn').addClass('send')
                }
                else if ($(this).find('.submit_wrapper .btn').hasClass('send')) {
                    if ($(this).find('.default-input.code').length > 0
                        && (!$(this).find('.default-input.code').inputmask('isComplete') || $(this).find('.default-input.code').val() == '')) {
                        $(this).find('.default-input.code').addClass('invalid')
                    }
                    if ($(this).find('.invalid').length == 0) {
                        // Тут можно разместить код обработки формы по ajax //
                        console.log('Валидация пройдена')
                    }
                }
            }
            if ($(this).hasClass('address-modal_form')) {
                var AllSelect = $(this).find('.default-select')
                /* console.log(AllSelect) */
                AllSelect.each(function (i, elem) {
                    if ($(elem).val() == '') {
                        $(elem).parent('.default-select_wrapper').addClass('invalid')
                    }
                })
                var AllInput = $(this).find('.default-input:not([type="checkbox"])')
                AllInput.each(function (i, elem) {
                    /*  var ThisInput = $(elem).children('.default-input') */
                    if (!$(elem).attr('type') != 'checkbox') {
                        if ($(elem).val() == '')
                            $(elem).addClass('invalid')
                    }
                })
                if ($(this).find('.invalid').length == 0) {
                    // Тут можно разместить код обработки формы по ajax //
                    console.log('Валидация пройдена')
                }
            }
            if ($(this).hasClass('form-profile-main')) {
                console.log('Валидация началась')
            }
            if ($(this).hasClass('code-modal_form')) {
                var AllInput = $(this).find('.default-input')
                AllInput.each(function (i, elem) {
                    if ($(elem).val() == '')
                        $(elem).addClass('invalid')
                })
                if ($(this).find('.invalid').length == 0) {
                    // Тут можно разместить код обработки формы по ajax //
                    console.log('Валидация пройдена')
                }
            }
        }
        e.preventDefault()
    })
    //----------------------// 

    // Удаление класса невалидности при изменении инпутов и селектов //
    $('body').on('input', '.default-input.invalid', function (e) {
        $(this).removeClass('invalid')
    })
    $('body').on('change', '.default-select', function (e) {
        $(this).parent('.default-select_wrapper.invalid').removeClass('invalid')
    })
    //----------------------// 

    // Добавление при скролле класса к header //
    $(window).scroll(function () {
        var NowPositionScroll = $(window).scrollTop();
        if (NowPositionScroll > 0) {
            $('header').addClass('scroll')
        }
        else {
            $('header.scroll').removeClass('scroll')
        }
    })
    //----------------------// 

    // Функционал адаптивного меню //
    if (DocWidth < 1200) {
        var AdaptiveMenuWrapper = "<div class='header_adaptmenu'><div class='header_adaptmenu-overlay'></div><div class='header_adaptmenu-wrapper'><a href='javascript: void(0)' class='menu-close'></a></div></div>"
        $(AdaptiveMenuWrapper).insertAfter($('.header_adaptive-menu-link'))
        $('.header_menu').appendTo('.header_adaptmenu-wrapper')
        if ($('.header_inprivate-wrapper').length > 0) {
            $('.header_inprivate-wrapper').insertAfter('.header_adaptmenu-wrapper .menu-close')
        }
        $('.header_private-link').insertAfter('.header_adaptmenu-wrapper .menu-close')
    }

    $('body').on('click', '.header_adaptive-menu-link', function (e) {
        $(this).siblings('.header_adaptmenu').fadeIn().addClass('show')
        blockScroll('open')
    })
    $('body').on('click', '.header_adaptmenu-wrapper .menu-close, .header_menu-link', function (e) {
        $(this).parents('.header_adaptmenu.show').fadeOut().removeClass('show')
        blockScroll('close')
    })
    $('body').on('click', '.header_adaptmenu-overlay', function (e) {
        $(this).parents('.header_adaptmenu.show').fadeOut().removeClass('show')
        blockScroll('close')
    })
    //----------------------// 

    // Инициализация слайдера навигации//
    var swiperNavMain
    var InitNavMainSlider = function (NavMainSlider) {
        swiperNavMain = new Swiper(NavMainSlider, {
            slidesPerView: 4,
            spaceBetween: 2.5,
            speed: 1500,
            setWrapperSize: true,
            autoHeight: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            allowTouchMove: false,
            /*             navigation: {
                            nextEl: '.arrow.arrow-next',
                            prevEl: '.arrow.arrow-prev',
                            disabledClass: 'disabled'
                        }, */
        })
    }
    if ($('.nav-main-slider-container').length > 0) {
        InitNavMainSlider($('.nav-main-slider-container'))
    }
    //----------------------//

    // Инициализация главного слайдера //
    var InitMainSlider = function (MainSlider) {
        var swiperMain = new Swiper(MainSlider, {
            slidesPerView: 1,
            spaceBetween: 30,
            speed: 1500,
            grabCursor: true,
            setWrapperSize: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            touchReleaseOnEdges: true,
            disableOnInteraction: false,
            autoplay: {
                delay: 8000,
            },
            thumbs: {
                swiper: swiperNavMain
            },
            navigation: {
                nextEl: '.nav-main-slider-container .arrow.arrow-next',
                prevEl: '.nav-main-slider-container .arrow.arrow-prev',
                disabledClass: 'disabled'
            },
            breakpoints: {
                1200: {
                    navigation: {
                        nextEl: '.main-slider-container .arrow.arrow-next',
                        prevEl: '.main-slider-container .arrow.arrow-prev',
                        disabledClass: 'disabled'
                    },
                },
            },
        })
    }
    if ($('.main-slider-container').length > 0) {
        InitMainSlider($('.main-slider-container'))
    }
    //----------------------// 

    // Инициализация слайдера с отзывыми //
    var InitTestimonialsSlider = function (TestimonialsSlider) {
        var swiperTestimonials = new Swiper(TestimonialsSlider, {
            slidesPerView: 4,
            spaceBetween: 40,
            speed: 1500,
            grabCursor: true,
            setWrapperSize: true,
            autoHeight: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            touchReleaseOnEdges: true,
            disableOnInteraction: false,
            loop: true,
            autoplay: {
                delay: 10000,
            },
            navigation: {
                nextEl: '.arrow.arrow-next',
                prevEl: '.arrow.arrow-prev',
                disabledClass: 'disabled'
            },
            breakpoints: {
                767: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                },
                1200: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
            },
        })
    }
    if ($('.testimonials-slider-container').length > 0) {
        InitTestimonialsSlider($('.testimonials-slider-container'))
    }
    //----------------------// 

    // Функционал работы табов //
    $('body').on('click', '.tabs-switcher_item:not(.active)', function (e) {
        if ($(this).parents('.tabs-menu_wrapper').length == 0
            || ($(this).parent('.tabs-switcher_wrapper').length > 0 && DocWidth >= 1200)
            || ($(this).parent('.tabs-slider-slide').length == 0 && DocWidth < 1200)) {
            $(this).siblings('.tabs-switcher_item.active').removeClass('active')
            $(this).addClass('active').hide().fadeIn()
            var TabSwitcherIndex = $(this).index()
            $(this).parent('.tabs-switcher_wrapper').next('.tabs-content_wrapper').children('.tabs-content_item.active').removeClass('active')
            $(this).parent('.tabs-switcher_wrapper').next('.tabs-content_wrapper').children('.tabs-content_item').eq(TabSwitcherIndex).addClass('active').hide().fadeIn()
        }
    })
    //----------------------// 

    // Функционал работы аккордеонов //
    $('body').on('click', '.accordeon_item .accordeon-title', function (e) {
        if ($(this).parent('.accordeon_item').hasClass('active')) {
            $(this).parent('.accordeon_item').removeClass('active')
        }
        else {
            $(this).parents('.accordeon_wrapper').find('.accordeon_item.active').removeClass('active')
            $(this).parent('.accordeon_item').addClass('active')
        }
    })
    //----------------------// 

    // Плавный переход на якорь на другой странице //
    $('body').on('click', '.header_menu-link[anchor]', function (e) {
        localStorage.setItem("anchor", $(this).attr('anchor'));

    })
    if (localStorage.getItem("anchor") && $(localStorage.getItem("anchor")).length > 0) {
        var anchor = localStorage.getItem("anchor")
        $('html,body').stop().animate({ scrollTop: $(anchor).offset().top - ($('header').height() + 30) }, 1000);
        localStorage.removeItem("anchor")
    }
    //----------------------// 

    // Анимация якорных ссылок //
    $("body").on('click', "a[href^='#']:not([rel]):not(.modal-open):not(.close-modal)", function (e) {
        $('html,body').stop().animate({ scrollTop: $(this.hash).offset().top - ($('header').height() + 30) }, 1000);
        e.preventDefault();
    });

    //----------------------//


    // Функционал перестановки элементов выбора меню в адаптиве, а также инициализация слайдера //
    if (DocWidth < 1200) {
        var TabsMenuSwitcher = $('.tabs-menu_wrapper > .tabs-switcher_wrapper > .tabs-switcher_item')
        console.log(TabsMenuSwitcher)
        var TabsMenuSwitcherSlider = "<div class='swiper-container tabs-slider-container'>" +
            "<div class='swiper-wrapper'></div >" +
            "<div class='arrow arrow-prev'></div>" +
            "<div class='arrow arrow-next'></div></div>"
        $(TabsMenuSwitcherSlider).prependTo('.tabs-menu_wrapper > .tabs-switcher_wrapper')
        TabsMenuSwitcher.each(function (index, elem) {
            console.log(elem)
            var SwiperSlide = "<div class='swiper-slide tabs-slider-slide'></div>"
            $(SwiperSlide).appendTo('.tabs-slider-container .swiper-wrapper')
            $(elem).appendTo('.tabs-slider-container .tabs-slider-slide:last-child')
        })
        // Инициализация слайдера выбора меню в мобильной версии сайта //
        var swiperTabs
        var InitTabsSlider = function (TabsSlider) {
            swiperTabs = new Swiper(TabsSlider, {
                slidesPerView: 3,
                spaceBetween: 20,
                speed: 800,
                grabCursor: true,
                setWrapperSize: true,
                autoHeight: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                touchReleaseOnEdges: true,
                disableOnInteraction: false,
                /* loop: true, */
                initialSlide: 1,
                centeredSlides: true,
                slideToClickedSlide: true,
                /* autoplay: {
                    delay: 8000,
                }, */
                navigation: {
                    nextEl: '.arrow.arrow-next',
                    prevEl: '.arrow.arrow-prev',
                    disabledClass: 'disabled'
                },
            })
        }
        if ($('.tabs-slider-container').length > 0) {
            InitTabsSlider($('.tabs-slider-container'))

            function SwitcherSlideTabs(switcherwrapper, index) {
                $(switcherwrapper).find('.tabs-switcher_item.active').removeClass('active')
                $(switcherwrapper).find('.tabs-slider-slide.swiper-slide-active').children('.tabs-switcher_item').addClass('active')
                $(switcherwrapper).next('.tabs-content_wrapper').children('.tabs-content_item.active').removeClass('active')
                $(switcherwrapper).next('.tabs-content_wrapper').children('.tabs-content_item').eq(index).addClass('active').hide().fadeIn()
            }

            var SwitcherWrapper = swiperTabs.$el[0].offsetParent
            SwitcherSlideTabs(SwitcherWrapper, swiperTabs.realIndex)
            console.log(swiperTabs.realIndex + " активный слайд")
            //----------------------//
            // Функционал переключения меню при прокрутке слайдера //
            swiperTabs.on('transitionStart', function () {
                SwitcherSlideTabs(SwitcherWrapper, swiperTabs.realIndex)
                /* $(SwitcherWrapper).find('.tabs-switcher_item.active').removeClass('active')
                $(SwitcherWrapper).find('.tabs-slider-slide.swiper-slide-active').children('.tabs-switcher_item').addClass('active')
                $(SwitcherWrapper).next('.tabs-content_wrapper').children('.tabs-content_item.active').removeClass('active')
                $(SwitcherWrapper).next('.tabs-content_wrapper').children('.tabs-content_item').eq(swiperTabs.realIndex).addClass('active').hide().fadeIn() */
            });
        }
        //----------------------//
        if ($('.menu-day_item.menu_add').length > 0) {
            var AllMenuWrapper = $('.menu-day_item.menu_add')
            /* console.log(AllMenuWrapper) */
            AllMenuWrapper.each(function (index, elem) {
                $(elem).appendTo($(elem).parents('.menu-day_wrapper'))
            })
        }

        //----------------------//
    }

    // Обработчик клика на выбор кол-ва дней питания во всплывающей форме при клике на кнопку "Хочу это меню" //
    $('body').on('click', '.form-menu_add-modal .menu-add_tabs-item:not(.active)', function (e) {
        $(this).siblings('.active').removeClass('active')
        $(this).addClass('active')
        var ThisPriceModal = parseInt($(this).parents('.form-menu_add-modal').attr('price'))
        console.log(ThisPriceModal)
        $(this).parents('.form-menu_add-modal').find('.menu_add-modal_right').hide()
        var PriceNoDiscount = ThisPriceModal * parseInt($(this).attr('days'))
        console.log(PriceNoDiscount)
        if ($(this).attr('discount') != '0') {
            var PriceDiscount = (ThisPriceModal * parseInt($(this).attr('days'))) - (ThisPriceModal * parseInt($(this).attr('days')) / 100 * parseInt($(this).attr('discount')))
            console.log(PriceDiscount)
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_discount .big-price').text(PriceDiscount)
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount .big-price').text(PriceNoDiscount)
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount').removeClass('hide')
        }
        else {
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_discount .big-price').text(PriceNoDiscount)
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount .big-price').text('')
            $(this).parents('.form-menu_add-modal').find('.menu_add-modal_price .price_nodiscount').addClass('hide')
        }
        $(this).parents('.form-menu_add-modal').find('.menu_add-modal_profit > span:last-child')
            .text(ThisPriceModal * parseInt($(this).attr('days')) / 100 * parseInt($(this).attr('discount')))
        $(this).parents('.form-menu_add-modal').find('.menu_add-modal_right').fadeIn()
    })
    //----------------------//
    // Инициализация анимации //
    new WOW().init();

    // Функционал перемещения и переключения заказов //
    if ($('.order-tab_item.active').length > 0 && $('.order-tab_item.active').index() == 0) {
        $('.order-tabs_wrapper .order-btn_prev').addClass('disabled')
    }
    if ($('.order-tab_item.active').length > 0 && $('.order-tab_item').length == 1) {
        $('.order-tabs_wrapper .order-btn').remove()
        $('.order-tabs_wrapper').css({ 'padding': '0' })
    }
    $('body').on('click', '.order-tab_item:not(.active)', function (e) {
        var position = $(this).position();
        var scrollItem = $('.order-tabs_items').scrollLeft();
        $('.order-tabs_items').animate({
            'scrollLeft': scrollItem + position.left - $(this).parent('.order-tabs_items').next('.order-btn').outerWidth()
        }, 300);
        $('.order-tab_item.active').removeClass('active')
        $(this).addClass('active');
        $('.order-tabs_wrapper .order-btn_next').removeClass('disabled')
        $('.order-tabs_wrapper .order-btn_prev').removeClass('disabled')
        if ($(this).index() == ($(this).parent('.order-tabs_items').find('.order-tab_item').length - 1)) {
            $('.order-tabs_wrapper .order-btn_next').addClass('disabled')
        }
        if ($(this).index() == 0) {
            $('.order-tabs_wrapper .order-btn_prev').addClass('disabled')
        }
        var IndexThisTab = $(this).index()
        $(this).parents('.order-tabs_wrapper').next('.order-contents_wrapper').find('.order-content_item.active').removeClass('active')
        $(this).parents('.order-tabs_wrapper').next('.order-contents_wrapper').find('.order-content_item').eq(IndexThisTab).addClass('active').hide().fadeIn()
    });
    $('body').on('click', '.order-tabs_wrapper .order-btn_prev:not(.disabled)', function (e) {
        e.preventDefault();
        $('.order-tab_item.active').prev('.order-tab_item:not(.active)').trigger('click');
    });
    $('body').on('click', '.order-tabs_wrapper .order-btn_next:not(.disabled)', function (e) {
        e.preventDefault();
        $('.order-tab_item.active').next('.order-tab_item:not(.active)').trigger('click');
    });
    //----------------------//

    $('body').on('click', '.order-main-tab_item', function (e) {
        $(this).parent('.order-main-tabs_wrapper').children('.order-main-tab_item.active').removeClass('active')
        $(this).addClass('active')
        var ThisIndex = $(this).index()
        $(this).parents('.order-main_top').next('.order-main-content_wrapper').children('.order-main-content_item.active').removeClass('active')
        $(this).parents('.order-main_top').next('.order-main-content_wrapper').children('.order-main-content_item').eq(ThisIndex).addClass('active').hide().fadeIn()
        if ($(this).parents('.order-main_top').next('.order-main-content_wrapper').children('.order-main-delivery').hasClass('active')) {
            $(this).parents('.order-main_top').next('.order-main-content_wrapper').children('.order-main-delivery').css({
                'min-height': $(this).parents('.order-main_top').next('.order-main-content_wrapper').children('.order-main-menu').height()
            })
        }
    })

    // Функционал работы рейтинга //
    $('.rating-area_item').hover(
        function () {
            if (!$(this).parent('.rating-area').hasClass('rating-ok')) {
                $(this).addClass('hover')
                $(this).prevUntil().addClass('hover')
            }
        },
        function () {
            if (!$(this).parent('.rating-area').hasClass('rating-ok')) {
                $(this).removeClass('hover')
                $(this).siblings('.rating-area_item.hover').removeClass('hover')
            }
        }
    )

    $('body').on('click', '.rating-area_item', function (e) {
        if (!$(this).parent('.rating-area').hasClass('rating-ok')) {
            $(this).parent('.rating-area').find('.rating-area_item.active').removeClass('active')
            $(this).addClass('active').removeClass('hover')
            $(this).prevUntil().addClass('active').removeClass('hover')
            $(this).parent('.rating-area').addClass('rating-ok')
        }
    })
    //----------------------//


    // Обработчик клика на кнопку "Изменить" адрес //
    $('body').on('click', '.order-main-delivery_item .btn_wrapper .link-green', function (e) {
        if (!$(this).hasClass('open')) {
            $(this).parent('.btn_wrapper').siblings('.order-main-delivery_item--edit').addClass('active').hide().fadeIn()
            $(this).addClass('open').children('img').hide()
            $(this).children('span').text('Сохранить')
        }
        else {
            $(this).removeClass('open')
            $(this).parent('.btn_wrapper').siblings('.order-main-delivery_item--edit').removeClass('active')
            $(this).children('img').fadeIn()
            $(this).children('span').text('Изменить')

        }
    })
    //----------------------//

    // Инициализация календарей //
    if ($('#datetimepicker1').length > 0 && $('#datetimepicker2').length > 0) {
        $('#datetimepicker1').datetimepicker({
            locale: 'ru',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            stepping: 1,
            /*   keepOpen: true,
              debug: true, */
            defaultDate: 'now',
            format: 'LL',
            ignoreReadonly: true,
            tooltips: {
                today: 'Сегодня',
                clear: 'Очистить',
                close: 'Закрыть',
                selectMonth: 'Выбрать месяц',
                prevMonth: 'Пред. месяц',
                nextMonth: 'След. месяц',
                selectYear: 'Выбрать год',
                prevYear: 'Пред. год',
                nextYear: 'След. год',
                selectDecade: 'Выбрать декаду',
                prevDecade: 'Пред. декада',
                nextDecade: 'След. декада',
                prevCentury: 'Пред. век',
                nextCentury: 'След. век'
            }
        });
        $('#datetimepicker2').datetimepicker({
            locale: 'ru',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            format: 'LL',
            stepping: 1,
            /*  keepOpen: true,
             debug: true, */
            useCurrent: false,
            ignoreReadonly: true,
            tooltips: {
                today: 'Сегодня',
                clear: 'Очистить',
                close: 'Закрыть',
                selectMonth: 'Выбрать месяц',
                prevMonth: 'Пред. месяц',
                nextMonth: 'След. месяц',
                selectYear: 'Выбрать год',
                prevYear: 'Пред. год',
                nextYear: 'След. год',
                selectDecade: 'Выбрать декаду',
                prevDecade: 'Пред. декада',
                nextDecade: 'След. декада',
                prevCentury: 'Пред. век',
                nextCentury: 'След. век'
            }
        });
    }

    $('body').on('click', '.date .form-control', function (e) {
        $(this).parent('.date').data("DateTimePicker").toggle()
    })
    $("#datetimepicker1").on("dp.change", function (e) {
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        // Вывод даты первого календаря
        console.log($(this).find('.table-condensed > tbody > tr > td.day.active').attr('data-day'))
    });
    $("#datetimepicker2").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        // Вывод даты второго календаря
        console.log($(this).find('.table-condensed > tbody > tr > td.day.active').attr('data-day'))
    });
    //----------------------//

    // Обрабочик клика на раскрытие состава заказа на странице история заказов //
    $('body').on('click', '.order-item .order-item_info', function (e) {
        if (!$(this).parent('.order-item').hasClass('open'))
            $(this).parent('.order-item').addClass('open')
        else {
            $(this).parent('.order-item.open').removeClass('open')
        }
        $(this).parent('.order-item').siblings('.open').removeClass('open')
        setTimeout(function () {
            if (($('header').innerHeight() + $('main').innerHeight() + $('footer').innerHeight()) > $(window).height() && $('footer')) {
                $('html').css('height', '');
                $('body').css('height', '')
                $('footer').css({ 'position': '', 'bottom': '', 'left': '' })
            }
            else {
                $('html').css('height', '100%');
                $('body').css('height', '100%')
                $('footer').css({ 'position': 'absolute', 'bottom': '0', 'left': '0' })
            }
            console.log(($('header').height() + $('main').height() + $('footer').height()))
            console.log($(window).height())
        }, 300)

    })
    //----------------------//


    // Обработчик клика на удаление дополнительного номера на странице личная информация //
    $('body').on('click', '.profile-contact_addphone .delete', function (e) {
        $(this).parents('.default-input_wrapper').fadeOut(300)
        var $this = $(this)
        setTimeout(function () {
            $this.parents('.default-input_wrapper').remove()
        }, 300)
    })
    //----------------------//

    // Добавление поля ввода дополнительного номера телефона на странице "Личная информация" //
    /*    $('body').on('click', '.profile-contact_addphone .btn_add', function (e) {
           var newPhone =
               "<div class='default-input_wrapper w-100'>" +
               "<div class='input-with-icon'>" +
               "<input type='tel' class='default-input phone w-100' name='Номер телефона'/>" +
               "<span class='delete'></span>" +
               "</div>" +
               "</div>"
           $(this).parent('.btn_wrapper').before($(newPhone))
           $(this).parent('.btn_wrapper').prev('.default-input_wrapper').hide().fadeIn()
           initPhoneMask()
   
       }) */
    //----------------------//


    // Функционал копирования текста в буфер обмена //
    function copytext(el) {
        var $tmp = $("<input>");
        $("body").append($tmp);
        $tmp.val($(el).val()).select();
        document.execCommand("copy");
        $tmp.remove();
    }

    $('body').on('click', '.copy', function (e) {
        copytext($(this).siblings('.default-input'))
    })

    //----------------------//

    // Функционал работы с адресами на странице личные данные //
    $('body').on('click', '.profile-address_item:not(.active)', function (e) {
        $(this).parent('.profile-address_item-block').siblings('.profile-address_item-block').find('.active').removeClass('active')
        $(this).addClass('active')
    })
    $('body').on('click', '.profile-address_item-block .options_wrapper-link', function (e) {
        console.log($(this).index())
        if ($(this).index() == '0') {
            $(this).parents('.profile-address_item-block').siblings('.profile-address_item-block').find('.active').removeClass('active')
            $(this).parents('.profile-address_options').siblings('.profile-address_item').addClass('active')
        }
        /*         if ($(this).index() == '2') {
                    if ($(this).parents('.profile-address_options').siblings('.profile-address_item.active').length > 0) {
                        console.log('активный элемент')
                    }
                    $(this).parents('.profile-address_item-block').fadeOut()
                } */
    })
    //----------------------//

    // Функционал скрытия и удаления уведомлений внизу экрана //
    function AlertMessages() {
        if ($('.alert-messages').length > 0) {
            setTimeout(function () {
                $('.alert-messages').addClass('out')
            }, 7000)
            setTimeout(function () {
                $('.alert-messages').remove()
            }, 8000)
        }
    }
    AlertMessages()
    //----------------------//

})


$(window).on('load', function () {
    // Проверка высоты контента и фиксация footer к низу страницы если контента мало //
    if (($('header').innerHeight() + $('main').innerHeight()) + $('footer').innerHeight() <= $(window).height()) {
        $('html').css('height', '100%');
        $('body').css('height', '100%')
        $('footer').css({ 'position': 'absolute', 'bottom': '0', 'left': '0' })
    }
    // ---------------------------- //
})