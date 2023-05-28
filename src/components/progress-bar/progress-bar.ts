import { Setting } from "obsidian";

import './progress-bar.scss';

export function createProgressBar(containerEl: HTMLElement) {
    const progressBar = containerEl.createDiv('aet_status-bar_progress-bar');

    progressBar.setAttribute('aria-label', 'Summaries, Titles & Tags progress bar');
    progressBar.setAttribute('aria-label-position', 'top');
    
    const progressBarFg = progressBar.createDiv('aet_bar');
    
    function updateProgress(filename: string, percentage: number) {
        console.log('setting progress');
        progressBar.setAttribute('aria-label', `processing ${filename}.md`);
        progressBarFg.style.width = percentage + '%';
    }

    return {
        progressBar,
        progressBarFg,
        updateProgress
    }
}