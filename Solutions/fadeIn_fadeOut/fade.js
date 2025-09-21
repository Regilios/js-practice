var MV = {
    _animations: new WeakMap(),
    _runAnimation: function(element, callback, duration) {
        // если есть незаконченная анимация → отменяем её
        let controller = this._animations.get(element);
        if (controller) controller.abort();

        const ac = new AbortController();
        this._animations.set(element, ac);

        callback(ac.signal);

        // очистка по таймауту (страховка от "висячих" transitionend)
        setTimeout(() => {
            if (!ac.signal.aborted) {
                this._animations.delete(element);
            }
        }, duration + 50);
    },
    //  свой fadeIn
    fadeInExpand: function(element, duration = 300) {
        if (!element) return;

        this._runAnimation(element, (signal) => {
            const originalTransition = element.style.transition;

            element.style.display = 'block';
            element.style.overflow = 'hidden';
            element.style.height = '0px';
            element.style.transition = `height ${duration}ms ease`;

            // форсируем reflow, чтобы transition гарантированно сработал
            element.getBoundingClientRect();

            requestAnimationFrame(() => {
                if (signal.aborted) return;
                element.style.height = element.scrollHeight + 'px';
            });

            const cleanup = () => {
                if (signal.aborted) return;
                element.style.height = 'auto';
                element.style.overflow = '';
                element.style.transition = originalTransition;
            };

            const onEnd = (e) => {
                if (e.propertyName === 'height') cleanup();
            };

            element.addEventListener('transitionend', onEnd, { once: true });
            setTimeout(cleanup, duration + 50); // fallback
        }, duration);
    },
    //  свой fadeOut
    fadeOutCollapse: function(element, duration = 300) {
        if (!element) return;

        this._runAnimation(element, (signal) => {
            const originalTransition = element.style.transition;
            const startHeight = element.scrollHeight + 'px';

            element.style.height = startHeight;
            element.style.overflow = 'hidden';
            element.style.transition = `height ${duration}ms ease`;
            // форсируем reflow, чтобы transition гарантированно сработал
            element.getBoundingClientRect();

            requestAnimationFrame(() => {
                if (signal.aborted) return;
                element.style.height = '0px';
            });

            const cleanup = () => {
                if (signal.aborted) return;
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = originalTransition;
            };

            const onEnd = (e) => {
                if (e.propertyName === 'height') cleanup();
            };

            element.addEventListener('transitionend', onEnd, { once: true });
            setTimeout(cleanup, duration + 50);
        }, duration);
    },
}