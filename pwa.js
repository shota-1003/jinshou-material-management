(function(){'use strict';
 const base='/jinshou-material-management/',button=document.getElementById('install-app');let promptEvent=null;
 if('serviceWorker' in navigator&&location.pathname.startsWith(base))navigator.serviceWorker.register('./sw.js',{scope:base,updateViaCache:'none'}).catch(()=>{});
 if(!button)return;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const update=()=>{button.hidden=standalone()};update();
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;button.hidden=false});
 window.addEventListener('appinstalled',()=>{promptEvent=null;button.hidden=true});
 button.addEventListener('click',async()=>{if(promptEvent){const event=promptEvent;promptEvent=null;await event.prompt();await event.userChoice;update();return}
  document.getElementById('install-help')?.remove();const dialog=document.createElement('dialog');dialog.id='install-help';dialog.setAttribute('aria-label','アプリのインストール');dialog.innerHTML='<h2>資材管理をアプリとして追加</h2><p><strong>Windows・Android</strong><br>Chrome / Edgeのメニューから「アプリをインストール」または「ホーム画面に追加」を選びます。</p><p><strong>iPhone・iPad</strong><br>Safariでこのページを開き、共有ボタンから「ホーム画面に追加」を選びます。</p><p>対応するブラウザーでは、資材管理専用のアイコンとウィンドウで開けます。</p><button type="button">閉じる</button>';dialog.style.cssText='max-width:440px;width:calc(100% - 40px);border:1px solid #9db5a8;border-radius:10px;padding:24px;color:#193b34;font:14px/1.7 system-ui';dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.append(dialog);dialog.showModal();
 });
})();
