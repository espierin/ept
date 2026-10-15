const topbar=document.querySelector('.top');
new ResizeObserver(()=>document.documentElement.style.setProperty('--nav-height',Math.ceil(topbar.getBoundingClientRect().height)+'px')).observe(topbar);
document.querySelectorAll('[data-demo-group]').forEach(group=>group.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;
 if(group.dataset.demoGroup==='single')group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 else button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));
}));
