import {
  ryzomCodeParser,
  IRyzomMessage,
  IRGBA,
  ryzomColorCodeToRGBA,
  RGBAToRyzomColorCode,
} from './ryzom-code';
import ClipboardJS from 'clipboard';
import * as AColorPicker from 'a-color-picker';
import { predefinedPalette } from './palette';

import './app.scss';

interface IMessage {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

// gmotd has limit length = 256 characters.
// gmotd = '/guildmotd ' + message = 256
const maxGmotd: number = 245;

// Crafter's message has limit length = 257 characters.
const maxCrafterMessage: number = 257;

const gCurrentMessage: IMessage = {
  text: '',
  selectionStart: 0,
  selectionEnd: 0,
};

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener(
    'change',
    event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const el = event.target as Element;
      if (el.matches('input[name=msg-type]:checked')) {
        updateMaxChar();
        updateCharCount(gCurrentMessage.text);
      }
    },
    false,
  );

  document.addEventListener(
    'input',
    event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const el = event.target as Element;
      if (el.matches('[id=message-editor]')) {
        const editor = messageEditor();
        gCurrentMessage.text = editor.value;
        gCurrentMessage.selectionStart = editor.selectionStart;
        gCurrentMessage.selectionEnd = editor.selectionEnd;

        updateCharCount(gCurrentMessage.text);
        updateMessageOutput(gCurrentMessage.text);
      }
    },
    false,
  );

  document.addEventListener(
    'keydown',
    event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const el = event.target as Element;
      if (el.matches('[id=message-editor]')) {
        const editor = messageEditor();
        gCurrentMessage.text = editor.value;
        gCurrentMessage.selectionStart = editor.selectionStart;
        gCurrentMessage.selectionEnd = editor.selectionEnd;
      }
    },
    false,
  );

  document.addEventListener(
    'click',
    event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const el = event.target as Element;
      if (el.matches('[id=message-editor]')) {
        const editor = messageEditor();
        gCurrentMessage.text = editor.value;
        gCurrentMessage.selectionStart = editor.selectionStart;
        gCurrentMessage.selectionEnd = editor.selectionEnd;
      }
    },
    false,
  );

  const clipboard = new ClipboardJS('#copy-btn', {
    text: trigger => {
      return messageType().value === 'gmotd'
        ? '/guildmotd ' + messageEditor().value.replace(/\n/gm, ' ')
        : messageEditor().value;
    },
  });
  clipboard.on('success', e => {
    e.clearSelection();
    e.trigger.setAttribute('data-tooltip', 'Copied!');
    setTimeout(() => {
      e.trigger.setAttribute('data-tooltip', 'Copy');
    }, 1000);
  });

  const colorPicker: AColorPicker.ACPController = AColorPicker.createPicker(
    '#color-picker',
    {
      palette: predefinedPalette,
    },
  );
  colorPicker.on('change', (picker, color) => {
    if (!color) {
      return;
    }
    onPickColor(color);
  }).off;
});

function onPickColor(color: string): void {
  const rgbPattern = /rgb\((\d+),\s(\d+),\s(\d+)\)/;
  const rgbaPattern = /rgba\((\d+),\s(\d+),\s(\d+),\s((\d|0.\d+))\)/;
  const iR = 1;
  const iG = 2;
  const iB = 3;
  const iA = 4;
  const rgba: IRGBA = { r: 0, g: 0, b: 0, a: 0 };

  if (color.match(rgbPattern)) {
    const c: RegExpExecArray = rgbPattern.exec(color)!;
    rgba.r = parseInt(c[iR], 10);
    rgba.g = parseInt(c[iG], 10);
    rgba.b = parseInt(c[iB], 10);
    rgba.a = 1;
  } else if (color.match(rgbaPattern)) {
    const c: RegExpExecArray = rgbaPattern.exec(color)!;
    rgba.r = parseInt(c[iR], 10);
    rgba.g = parseInt(c[iG], 10);
    rgba.b = parseInt(c[iB], 10);
    rgba.a = parseFloat(c[iA]);
  }
  const ryzomColor = RGBAToRyzomColorCode(rgba);
  insertColorAtSelection(messageEditor(), gCurrentMessage, ryzomColor);

  const editor = messageEditor();
  updateCharCount(editor.value);
  updateMessageOutput(editor.value);
}

const messageType = (): HTMLInputElement => {
  return document.querySelector(
    'input[name=msg-type]:checked',
  ) as HTMLInputElement;
};

const messageEditor = (): HTMLTextAreaElement => {
  return document.getElementById('message-editor') as HTMLTextAreaElement;
};

const messageOutput = (): HTMLTextAreaElement => {
  return document.getElementById('message-output') as HTMLTextAreaElement;
};

function insertColorAtSelection(
  editor: HTMLTextAreaElement,
  message: IMessage,
  color: string,
): void {
  editor.value =
    message.text.substring(0, message.selectionStart) +
    color +
    message.text.substring(message.selectionEnd, message.text.length);
  editor.selectionStart = message.selectionStart + color.length;
  editor.selectionEnd = message.selectionStart + color.length;
}

function updateMaxChar(): void {
  const maxCharUi: HTMLElement = document.getElementById('max-char')!;
  maxCharUi.innerText =
    messageType().value === 'gmotd'
      ? maxGmotd.toString()
      : maxCrafterMessage.toString();
}

function updateCharCount(text: string): void {
  const maxChar =
    messageType().value === 'gmotd' ? maxGmotd : maxCrafterMessage;
  const count = text.length;

  const charCount = document.getElementById('char-count') as HTMLInputElement;
  charCount.innerText = count.toString();
  if (count > maxChar) {
    charCount.style.color = 'hsl(348, 100%, 61%)';
  } else {
    charCount.style.color = 'hsl(0, 0%, 4%)';
  }
}

function updateMessageOutput(text: string): void {
  const messages = ryzomCodeParser(text);
  if (!messages) {
    messageOutput().innerHTML = '<pre class="output-pre"></pre>';
    return;
  }

  let output = '';
  messages.forEach((message: IRyzomMessage) => {
    const color: IRGBA = ryzomColorCodeToRGBA(message.color)!;

    let colorProp = messages.length > 1 ? 'white' : 'yellow';
    if (color) {
      colorProp = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }

    output += `<span style="color: ${colorProp}">${message.text}</span>`;
  });
  messageOutput().innerHTML = '<pre class="output-pre">' + output + '</pre>';
}
