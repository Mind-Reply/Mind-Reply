// MindReply Extension — Content Script
// Detects active compose windows in Gmail and Outlook, injects MRagent trigger.

const SITE_URL = 'https://mind-reply.com';

// ─── Selectors ────────────────────────────────────────────────────────────────

const GMAIL_COMPOSE = '[role="textbox"][aria-label*="compose"], [role="textbox"][aria-label*="Body"]';
const OUTLOOK_COMPOSE = '[aria-label*="Message body"], [data-testid*="compose"] [role="textbox"]';

const SELECTORS = `${GMAIL_COMPOSE}, ${OUTLOOK_COMPOSE}`;

// ─── Injected element tracking ────────────────────────────────────────────────

const injectedElements = new WeakSet();

// ─── Inject MRagent trigger ───────────────────────────────────────────────────

function injectTrigger(textarea: Element) {
  if (injectedElements.has(textarea)) return;
  injectedElements.add(textarea);

  const wrapper = document.createElement('div');
  wrapper.className = 'mr-trigger-wrapper';
  wrapper.style.cssText = `
    position: absolute;
    bottom: 8px;
    right: 8px;
    z-index: 9999;
  `;

  const trigger = document.createElement('button');
  trigger.className = 'mr-trigger';
  trigger.title = 'Refine with MRagent';
  trigger.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="url(#mrGrad)"/>
      <text x="12" y="16" text-anchor="middle" font-family="serif" font-size="11" font-style="italic" fill="#09090b">M</text>
      <defs>
        <linearGradient id="mrGrad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stop-color="#c9a96e"/>
          <stop offset="100%" stop-color="#7c6b52"/>
        </linearGradient>
      </defs>
    </svg>
  `;
  trigger.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.75;
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;

  trigger.addEventListener('mouseenter', () => {
    trigger.style.opacity = '1';
    trigger.style.transform = 'scale(1.1)';
  });
  trigger.addEventListener('mouseleave', () => {
    trigger.style.opacity = '0.75';
    trigger.style.transform = 'scale(1)';
  });

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = (textarea as HTMLElement).innerText ?? '';
    openMRagentPanel(text, textarea as HTMLElement);
  });

  wrapper.appendChild(trigger);

  // Position relative to textarea
  const parent = textarea.parentElement;
  if (parent) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') {
      (parent as HTMLElement).style.position = 'relative';
    }
    parent.appendChild(wrapper);
  }
}

// ─── Open MRagent Panel ───────────────────────────────────────────────────────

let activePanel: HTMLIFrameElement | null = null;

function openMRagentPanel(text: string, sourceTextarea: HTMLElement) {
  // Remove existing panel
  if (activePanel) {
    activePanel.remove();
    activePanel = null;
  }

  const panel = document.createElement('iframe');
  panel.src = `${SITE_URL}/extension-panel?text=${encodeURIComponent(text.slice(0, 2000))}`;
  panel.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 400px;
    height: 560px;
    border: 1px solid rgba(201,169,110,0.3);
    border-radius: 20px;
    box-shadow: 0 16px 64px rgba(0,0,0,0.5);
    z-index: 99999;
    background: #111115;
  `;

  document.body.appendChild(panel);
  activePanel = panel;

  // Listen for replacement message from panel
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== SITE_URL) return;
    if (event.data?.type === 'mr:replace') {
      sourceTextarea.focus();
      document.execCommand('selectAll', false, undefined);
      document.execCommand('insertText', false, event.data.text);
      panel.remove();
      activePanel = null;
      window.removeEventListener('message', handleMessage);
    }
    if (event.data?.type === 'mr:close') {
      panel.remove();
      activePanel = null;
      window.removeEventListener('message', handleMessage);
    }
  };

  window.addEventListener('message', handleMessage);
}

// ─── Observer ─────────────────────────────────────────────────────────────────

function scanAndInject() {
  const textareas = document.querySelectorAll(SELECTORS);
  textareas.forEach((el) => injectTrigger(el));
}

const observer = new MutationObserver(() => {
  scanAndInject();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial scan
scanAndInject();

// ─── Close panel on Escape ────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activePanel) {
    activePanel.remove();
    activePanel = null;
  }
});
