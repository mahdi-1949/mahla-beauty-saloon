'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const legacy={services:'services.html',about:'about.html',team:'team.html',gallery:'gallery.html',journal:'journal.html',faq:'faq.html',contact:'contact.html',booking:'booking.html',privacy:'privacy.html','service/hair':'service-hair.html','service/makeup':'service-makeup.html','service/skin':'service-skin.html','service/nails':'service-nails.html','service/lashes':'service-brows.html','article/0':'article-0.html','article/1':'article-1.html','article/2':'article-2.html'};
if(location.hash.startsWith('#/')){const route=location.hash.slice(2);if(legacy[route])location.replace(legacy[route]);else history.replaceState(null,'',location.pathname+location.search)}
const header=$('.site-header'),nav=$('#mainNav'),servicesToggle=$('.services-toggle'),mega=$('#megaPanel'),menuToggle=$('.menu-toggle'),overlay=$('.nav-overlay');
const menuIcon=close=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(close?'m6 6 12 12M6 18 18 6':'M4 7h16M4 12h16M4 17h16')+'"/></svg>';
function syncOverlay(){overlay.classList.toggle('open',nav.classList.contains('mobile-open')||mega.classList.contains('open'))}
function setServices(open){mega.classList.toggle('open',open);servicesToggle.setAttribute('aria-expanded',String(open));syncOverlay()}
function setMenu(open){nav.classList.toggle('mobile-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'بستن منو':'باز کردن منو');menuToggle.innerHTML=menuIcon(open);if(!open)setServices(false);syncOverlay()}
servicesToggle.addEventListener('click',()=>setServices(!mega.classList.contains('open')));
menuToggle.addEventListener('click',()=>setMenu(!nav.classList.contains('mobile-open')));
overlay.addEventListener('click',()=>{setServices(false);setMenu(false)});
document.addEventListener('click',e=>{if(!e.composedPath().includes(header)){setServices(false);setMenu(false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(mega.classList.contains('open')||nav.classList.contains('mobile-open'))){const isMobile=nav.classList.contains('mobile-open');setServices(false);setMenu(false);(isMobile?menuToggle:servicesToggle).focus()}});
header.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement)){setServices(false);setMenu(false)}},0));
matchMedia('(min-width:951px)').addEventListener('change',()=>{setServices(false);setMenu(false)});
const dialog=$('#lightbox'),lightboxButtons=$$('[data-lightbox]');let currentImages=[],imageIndex=0,lastImageButton=null;
function showImage(){const b=currentImages[imageIndex];$('#lightboxImage').src=b.dataset.lightbox;$('#lightboxImage').alt=b.dataset.caption;$('#lightboxCaption').textContent=b.dataset.caption;$('#lightboxCount').textContent=(imageIndex+1)+' / '+currentImages.length}
function changeImage(delta){imageIndex=(imageIndex+delta+currentImages.length)%currentImages.length;showImage()}
lightboxButtons.forEach(b=>b.addEventListener('click',()=>{currentImages=lightboxButtons.filter(x=>!x.closest('[hidden]'));imageIndex=currentImages.indexOf(b);lastImageButton=b;showImage();dialog.showModal();document.body.style.overflow='hidden'}));
$('.lightbox-close').addEventListener('click',()=>dialog.close());
$('#lightboxPrev').addEventListener('click',()=>changeImage(-1));$('#lightboxNext').addEventListener('click',()=>changeImage(1));
dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close()}});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();changeImage(1)}if(e.key==='ArrowRight'){e.preventDefault();changeImage(-1)}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastImageButton?.focus()});
const persianNumber=n=>String(n).replace(/[0-9]/g,n=>'۰۱۲۳۴۵۶۷۸۹'[n]);
$$('[data-gallery-filter]').forEach(b=>b.addEventListener('click',()=>{let count=0;$$('[data-gallery-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-gallery-category]').forEach(x=>{x.hidden=b.dataset.galleryFilter!=='all'&&x.dataset.galleryCategory!==b.dataset.galleryFilter;if(!x.hidden)count++});$('#galleryCount').textContent=persianNumber(count)+' تصویر'}));
const normalize=s=>s.replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]+/g,' ').trim().toLowerCase();
if($('#faqSearch')){let category='all';function filterFaq(){const q=normalize($('#faqSearch').value);let count=0;$$('#faqResults details').forEach(x=>{x.hidden=(category!=='all'&&x.dataset.category!==category)||(q&&!normalize(x.textContent).includes(q));if(!x.hidden)count++});$('#faqStatus').textContent=persianNumber(count)+' پاسخ';$('#faqEmpty').hidden=count>0}$('#faqSearch').addEventListener('input',filterFaq);$$('[data-faq-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.faqFilter;$$('[data-faq-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterFaq()}))}
const wizard=$('#bookingForm');
if(wizard){
const names={consult:'مشاورهٔ اولیه',hair:'مو و رنگ',makeup:'میکاپ و استایل',nails:'ناخن و طراحی',skin:'پوست و مراقبت',brows:'مژه و ابرو',bridal:'تجربهٔ عروس'};
let step=0;const steps=$$('.wizard-step',wizard),progress=$$('.wizard-progress li',wizard),next=$('#bookingNext'),back=$('#bookingBack'),error=$('#bookingError');
const date=new Date();date.setMinutes(date.getMinutes()-date.getTimezoneOffset());$('#bookingDate').min=date.toISOString().slice(0,10);
const preselect=new URLSearchParams(location.search).get('service');if(names[preselect])$('input[name="service"][value="'+preselect+'"]',wizard).checked=true;
function summary(target){target.replaceChildren();const data=new FormData(wizard);for(const [label,value]of [['خدمت',names[data.get('service')]],['تاریخ پیشنهادی',data.get('date')],['بازهٔ زمانی',data.get('time')]]){const row=document.createElement('div'),b=document.createElement('b'),span=document.createElement('span');b.textContent=label;span.textContent=value||'انتخاب نشده';row.append(b,span);target.append(row)}}
function showStep(){steps.forEach((s,i)=>s.hidden=i!==step);progress.forEach((s,i)=>{if(i===step)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current')});back.hidden=step===0;next.textContent=step===2?'نمایش پیش‌نمایش درخواست':'مرحلهٔ بعد';error.textContent='';if(step===2)summary($('#bookingSummary'));$('h2',steps[step]).focus()}
function valid(){for(const f of $$('input,select',steps[step]))if(!f.checkValidity()){error.textContent=step===0?'یک خدمت انتخاب کن.':'اطلاعات این مرحله را کامل و درست وارد کن.';f.reportValidity();return false}if(step===1&&$('#bookingDate').value<$('#bookingDate').min){error.textContent='تاریخ پیشنهادی باید امروز یا بعد از آن باشد.';$('#bookingDate').focus();return false}if(step===2){const phone=$('#bookingPhone').value.replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[\s()-]/g,'');if(!/^\+?\d{8,15}$/.test(phone)){error.textContent='شمارهٔ تماس را با ۸ تا ۱۵ رقم وارد کن.';$('#bookingPhone').focus();return false}if($('#bookingName').value.trim().length<2){error.textContent='نام را کامل‌تر وارد کن.';$('#bookingName').focus();return false}}return true}
next.addEventListener('click',()=>{if(!valid())return;if(step<2){step++;showStep()}else{summary($('#successSummary'));wizard.hidden=true;$('#bookingSuccess').hidden=false;$('#bookingSuccess').focus();wizard.reset()}});
back.addEventListener('click',()=>{if(step>0){step--;showStep()}});
wizard.addEventListener('submit',e=>{e.preventDefault();next.click()});
$('#bookingRestart').addEventListener('click',()=>{wizard.hidden=false;$('#bookingSuccess').hidden=true;step=0;showStep()});
}
$('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();$('#contactStatus').textContent='فرم بررسی شد؛ این نسخه نمایشی است و پیامی ارسال یا ذخیره نشده است.'});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');observer.unobserve(e.target)}}),{threshold:.05});$$('main>.section').forEach(x=>observer.observe(x))}
// Dedicated drawer controls and accessible mobile footer groups.
const drawerClose=$('.mobile-nav-close');
drawerClose?.addEventListener('click',()=>{setMenu(false);menuToggle.focus()});
menuToggle.addEventListener('click',()=>{if(nav.classList.contains('mobile-open'))drawerClose?.focus()});
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!nav.classList.contains('mobile-open'))return;const nodes=$$('a,button,input,select',nav).filter(x=>!x.disabled&&x.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
const footerMedia=matchMedia('(max-width:700px)'),footerGroups=$$('.footer-group');
function setFooterMode(){footerGroups.forEach((g,i)=>{const button=$('.footer-toggle',g),panel=$('.footer-links',g);panel.hidden=footerMedia.matches&&i!==0;button.setAttribute('aria-expanded',String(!panel.hidden))})}
footerGroups.forEach(g=>$('.footer-toggle',g).addEventListener('click',()=>{if(!footerMedia.matches)return;const p=$('.footer-links',g);p.hidden=!p.hidden;$('.footer-toggle',g).setAttribute('aria-expanded',String(!p.hidden))}));
footerMedia.addEventListener('change',setFooterMode);setFooterMode();
