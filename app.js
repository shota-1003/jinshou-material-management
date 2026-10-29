(function(){'use strict';
const client=new SharedInventory.Client({bridge:(method,params)=>portalSession.call(method,params),identity:()=>portalSession.identity(),queue:InventoryUploadQueue()});
let generation=0;
const identityKey=()=>{const a=portalSession.identity();return a?.code?JSON.stringify([a.kind||'employee',a.code,a.authEpoch??null]):null};
async function render(){const ticket=++generation,box=document.getElementById('materials');client.invalidate();box.replaceChildren();
 if(!portalSession.connected()){const p=document.createElement('p');p.textContent='資材管理を利用するにはログインしてください。';const a=document.createElement('a');a.href='./login.html';a.textContent='ログインする';box.append(p,a);return}
 const p=document.createElement('p');p.textContent='資材管理の利用権限を確認しています…';box.append(p);
 const identity=identityKey(),sameIdentity=()=>identity!==null&&portalSession.connected()&&identityKey()===identity;
 try{
  if(!identity)throw Error('ログインを確認してください。');
  const capabilities=await portalSession.call('inventory',{action:'capabilities'});
  if(ticket!==generation)return;
  if(!sameIdentity())throw Error('ログインが変わりました。もう一度ログインを確認してください。');
  if(capabilities.manager!==true&&capabilities.materialTotalsRead!==true)throw Error('このログインでは資材総数一覧を利用できません。社員としてログインしてください。');
  if(capabilities.manager===true&&!capabilities.materialTotals)throw Error('総数管理の本番連携は準備中です。まだ登録・更新はできません。');
  p.textContent='資材の総数を読み込んでいます…';
  const view=await client.load();
  if(ticket!==generation)return;
  if(!sameIdentity())throw Error('ログインが変わりました。もう一度ログインを確認してください。');
  if(view.capabilities.manager!==true&&view.capabilities.materialTotalsRead!==true)throw Error('このログインでは資材総数一覧を利用できません。社員としてログインしてください。');
  if(view.capabilities.manager===true&&!view.capabilities.materialTotals)throw Error('総数管理の本番連携は準備中です。まだ登録・更新はできません。');
  await MaterialTotals.mount(box,{view,client});
 }catch(error){if(ticket===generation){box.replaceChildren();const message=document.createElement('p');message.setAttribute('role','alert');message.textContent=error.message;const retry=document.createElement('button');retry.textContent='再読み込み';retry.onclick=render;box.append(message,retry)}}
}
window.addEventListener('portal-session-ready',render);
})();
