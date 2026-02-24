<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	getBgBlur,
	getDefaultHue,
	getHideBg,
	getHue,
	getRainbowMode,
	getRainbowSpeed,
	getStoredTheme,
	setBgBlur,
	setHideBg,
	setHue,
	setRainbowMode,
	setRainbowSpeed,
	setTheme,
} from "@utils/setting-utils";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config";

let hue = $state(getHue());
let theme = $state(getStoredTheme());
let isRainbowMode = $state(getRainbowMode());
let rainbowSpeed = $state(getRainbowSpeed());
let bgBlur = $state(getBgBlur());
let hideBg = $state(getHideBg());
const defaultHue = getDefaultHue();

onMount(() => {
	if (isRainbowMode) {
		document.documentElement.classList.add("is-rainbow-mode");
		startRainbowAnimation();
	}
	
	const handleThemeChange = (e: CustomEvent<{ theme: LIGHT_DARK_MODE }>) => {
		theme = e.detail.theme;
	};
	window.addEventListener("themechange", handleThemeChange as EventListener);
	
	return () => {
		window.removeEventListener("themechange", handleThemeChange as EventListener);
	};
});

function resetHue() {
	hue = getDefaultHue();
	setHue(hue);
}

function switchTheme(newTheme: LIGHT_DARK_MODE) {
	theme = newTheme;
	setTheme(newTheme);
}

function toggleRainbow() {
	isRainbowMode = !isRainbowMode;
	setRainbowMode(isRainbowMode);

	if (isRainbowMode) {
		document.documentElement.classList.add("is-rainbow-mode");
		startRainbowAnimation();
	} else {
		document.documentElement.classList.remove("is-rainbow-mode");
		stopRainbowAnimation();
		setHue(hue);
	}
}

let rainbowInterval: number | null = null;

function startRainbowAnimation() {
	let currentHue = 0;
	rainbowInterval = window.setInterval(() => {
		currentHue = (currentHue + rainbowSpeed * 0.5) % 360;
		document.documentElement.style.setProperty(
			"--hue",
			String(Math.floor(currentHue)),
		);
	}, 200);
}

function stopRainbowAnimation() {
	if (rainbowInterval) {
		clearInterval(rainbowInterval);
		rainbowInterval = null;
	}
}

function toggleHideBg() {
	hideBg = !hideBg;
	setHideBg(hideBg);
}

function onSpeedChange(e: Event) {
	const target = e.target as HTMLInputElement;
	rainbowSpeed = parseInt(target.value);
	setRainbowSpeed(rainbowSpeed);
	if (isRainbowMode) {
		stopRainbowAnimation();
		startRainbowAnimation();
	}
}

function onHueInput(e: Event) {
	const target = e.target as HTMLInputElement;
	hue = parseInt(target.value);
	setHue(hue);
}

function onBgBlurInput(e: Event) {
	const target = e.target as HTMLInputElement;
	bgBlur = parseInt(target.value);
	setBgBlur(bgBlur);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题模式
        </div>
        <div class="flex gap-1">
            <button aria-label="Light Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === LIGHT_MODE ? 'bg-[var(--primary)] text-white' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                onclick={() => switchTheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-rounded" class="text-[1.1rem]"></Icon>
            </button>
            <button aria-label="Dark Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === DARK_MODE ? 'bg-[var(--primary)] text-white' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                onclick={() => switchTheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-rounded" class="text-[1.1rem]"></Icon>
            </button>
            <button aria-label="Auto Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === AUTO_MODE ? 'bg-[var(--primary)] text-white' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                onclick={() => switchTheme(AUTO_MODE)}
            >
                <Icon icon="material-symbols:hdr-auto-rounded" class="text-[1.1rem]"></Icon>
            </button>
        </div>
    </div>

    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题色彩
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-12 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-3">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue} oninput={onHueInput}
               class="slider" id="colorSlider" step="5" style="width: 100%" disabled={isRainbowMode}>
    </div>

    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            禁用背景
        </div>
        <button aria-label="Hide Background"
            class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
            {hideBg ? 'bg-[var(--primary)] text-white' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
            onclick={toggleHideBg}
        >
            <Icon icon="material-symbols:visibility-off-outline-rounded" class="text-[1.1rem]"></Icon>
        </button>
    </div>

    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            彩虹模式
        </div>
        <button aria-label="Rainbow Mode"
            class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
            {isRainbowMode ? 'bg-[var(--primary)] text-white' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
            onclick={toggleRainbow}
        >
            <Icon icon="material-symbols:palette-rounded" class="text-[1.1rem]"></Icon>
        </button>
    </div>

    {#if isRainbowMode}
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            变换速率
        </div>
        <div class="flex gap-1">
             <div class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {rainbowSpeed}
            </div>
        </div>
    </div>
    <div class="w-full h-6 bg-[var(--btn-regular-bg)] rounded select-none overflow-hidden mb-3">
        <input aria-label="变换速率" type="range" min="1" max="100" bind:value={rainbowSpeed} oninput={onSpeedChange}
               class="slider" step="1" style="width: 100%; --value-percent: {(rainbowSpeed - 1) / 99 * 100}%">
    </div>
    {/if}

    <div class="flex flex-row gap-2 mb-3 mt-4 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            背景模糊
        </div>
        <div class="flex gap-1">
            <div class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {bgBlur}
            </div>
        </div>
    </div>
    <div class="w-full h-6 bg-[var(--btn-regular-bg)] rounded select-none overflow-hidden">
        <input aria-label="背景模糊" type="range" min="0" max="20" bind:value={bgBlur} oninput={onBgBlurInput}
               class="slider" step="1" style="width: 100%; --value-percent: {bgBlur / 20 * 100}%">
    </div>
</div>


<style>
    #display-setting input[type="range"] {
        -webkit-appearance: none;
        height: 1.5rem;
        background-color: transparent;
        transition: background-image 0.15s ease-in-out;
    }

    #display-setting input[type="range"]:not(#colorSlider) {
        background-image: linear-gradient(to right, var(--primary) 0%, var(--primary) var(--value-percent), transparent var(--value-percent), transparent 100%);
    }

    #display-setting #colorSlider {
        background-image: var(--color-selection-bar);
    }

    #display-setting input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 0;
        width: 0;
        background: transparent;
        box-shadow: none;
        border: none;
    }

    #display-setting #colorSlider::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 1rem;
        width: 0.5rem;
        border-radius: 0.125rem;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: none;
        margin-top: 0;
        transform: none;
        transition: background 0.15s;
    }

    #display-setting #colorSlider::-webkit-slider-thumb:hover {
        background: rgba(255, 255, 255, 0.8);
    }

    #display-setting #colorSlider::-webkit-slider-thumb:active {
        background: rgba(255, 255, 255, 0.6);
    }

    #display-setting input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none;
        height: 0;
        width: 0;
        background: transparent;
        box-shadow: none;
        border: none;
    }

    #display-setting #colorSlider::-moz-range-thumb {
        -webkit-appearance: none;
        height: 1rem;
        width: 0.5rem;
        border-radius: 0.125rem;
        border-width: 0;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: none;
        transform: none;
        transition: background 0.15s;
    }

    #display-setting #colorSlider::-moz-range-thumb:hover {
        background: rgba(255, 255, 255, 0.8);
    }

    #display-setting #colorSlider::-moz-range-thumb:active {
        background: rgba(255, 255, 255, 0.6);
    }
</style>
