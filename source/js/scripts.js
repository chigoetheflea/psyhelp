"use strict";

const TITLE_SLIDER_BUTTON_ACTIVE_CLASS = `title-slider__button--active`;
const MENU_ACTIVE_CLASS = `navigation--active`;
const HEADER_STICKY_CLASS = `page-header--sticky`;
const SCROLL_OFFSET = 100;
const STICKY_MIN_WIDTH = 1150;
const STICKY_OFFSET = 100;

$(function() {
  /* title slider */

  /* reviews slider */
  const reviewsSlider = $(`.js-reviews-slider`);
  const reviewSliderNext = $(`.js-reviews-next`);
  const reviewSliderPrev = $(`.js-reviews-prev`);

  reviewsSlider.owlCarousel({
    loop: true,
    nav: false,
    dots: false,
    lazyLoad: true,
    responsive: {
        0: {
            items: 1
        },
        990: {
            items: 3
        }
    }
  });

  reviewSliderNext.on(`click`, () => {
    reviewsSlider.trigger(`next.owl.carousel`);
  });

  reviewSliderPrev.on(`click`, () => {
    reviewsSlider.trigger(`prev.owl.carousel`);
  });
  /* reviews slider */

  /* stuff slider */
  const stuffSlider = $(`.js-stuff-slider`);
  const stuffSliderNext = $(`.js-stuff-next`);
  const stuffSliderPrev = $(`.js-stuff-prev`);

  stuffSlider.owlCarousel({
    loop: true,
    nav: false,
    dots: false,
    lazyLoad: true,
    items: 1,
    autoHeight: true
  });

  stuffSliderNext.on(`click`, () => {
    stuffSlider.trigger(`next.owl.carousel`);
  });

  stuffSliderPrev.on(`click`, () => {
    stuffSlider.trigger(`prev.owl.carousel`);
  });
  /* stuff slider */

  /* accordeon */
  const faq = $(`.js-accordeon`);
  const faqItems = faq.find(`.faq__item`);
  const faqContent = faq.find(`.faq__text`);

  faqItems.filter(`.faq__item--active`).find(`.faq__text`).show();

  faqItems.each(function() {
    const that = $(this);
    const faqButton = that.find(`.faq__button`);
    const activeContent = that.find(`.faq__text`);

    faqButton.on(`click`, function() {
      const isActive = $(that).hasClass(`faq__item--active`);

      faqItems.removeClass(`faq__item--active`);
      faqContent.hide();

      if(!isActive) {
        that.addClass(`faq__item--active`);

        activeContent.fadeIn(300);
      }
    });
  });
  /* accordeon */

  /* menu */
  const menu = $(`.js-navigation`);
  const menuButton = menu.find(`.js-navigation-button`);

  menuButton.on(`click`, () => {
    menu.toggleClass(MENU_ACTIVE_CLASS);
  });
  /* menu */

  /* scroll */
  const scrollLinks = $(`.js-scroll`);

  scrollLinks.each(function() {
    $(this).on(`click`, function(evt) {
      evt.preventDefault();

      const that = $(evt.target);
      const target = $(that.attr(`href`));

      if (menu.hasClass(MENU_ACTIVE_CLASS)) {
        menu.removeClass(MENU_ACTIVE_CLASS);
      }

      if (target.length) {
        $(`body, html`).animate({scrollTop: $(target).offset().top - SCROLL_OFFSET}, 300);
      }
    });
  });
  /* scroll */

  /* header */
  const pageHeader = $(`.page-header`);

  $(window).on(`scroll`, function() {
    const isSticky = $(this).width() > STICKY_MIN_WIDTH && $(this).scrollTop() > STICKY_OFFSET;

    if (isSticky) {
      pageHeader.addClass(HEADER_STICKY_CLASS);
    } else {
      pageHeader.removeClass(HEADER_STICKY_CLASS);
    }
  });
  /* header */

  /* form */
  const toggleSubmitDisabling = (form, isDisable) => {
    if(isDisable) {
      $(form).find(`.js-submit-button`).attr(`disabled`, `disabled`);
    } else {
      $(form).find(`.js-submit-button`).removeAttr(`disabled`);
    }
  };

  const showMailResult = (selector) => {
    const form = $(selector);
    const result = form.find(`.form__result`);
    result.find(`span`).textContent = ``;

    result.addClass(`form__result--active`);

    if(!result.children(`span`).attr(`data-error`)) {
      setTimeout(() => {
        result.removeClass(`form__result--active`);
        $(`body`).removeClass(`js-modal-open`);
        form.find(`input,textarea`).not(`[type=hidden]`).val(``).removeClass(`error valid`);

        toggleSubmitDisabling(selector, false);
      }, 3000);
    } else {
      toggleSubmitDisabling(selector, false);
    }
  };

  const mailOptions = {
    url: `http://help.psy-in.ru/lib/mail.php`,
    type: `post`,
    target: `#request_result`,
    success: () => {showMailResult(`#request_form`)},
    error: () => {toggleSubmitDisabling(`#request_form`, false)}
  };

  $("#request_form").validate({
		rules:{
			request_name: {
				required: true,
				minlength: 2
      },
      request_phone: {
				required: true,
				phoneGLOBAL: true
      },
      request_email: {
        required: true,
        emailGLOBAL: true,
        email: false
      }
		},
		messages: {
			request_name: {
				required: ``,
				minlength: ``
      },
      request_phone: {
				required: ``,
				phoneGLOBAL: ``
      },
      request_email: {
        required: ``,
        emailGLOBAL: ``,
        email: ``
      }
		},
		submitHandler: (form) => {
      toggleSubmitDisabling(form, true);

      jQuery(form).ajaxSubmit(mailOptions);

      return false;
		}
	});
  /* form */
});
