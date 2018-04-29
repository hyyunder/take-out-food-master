'use strict';
const loadAllItems= require('../src/items');
const loadPromotions=require('../src/promotions');
function bestCharge(selectedItems) {
  var result="============= 订餐明细 =============\n";
  var inputId=[];
  var inputNum=[];
  var food=loadAllItems();
  var promotion=loadPromotions();
  var moneyNotPromotion=0;
  var moneyPromotion1=0;
  var moneyPromotion2=0;

  //取出订餐的所有餐品id，存入inputId数组
  inputId=SelectId(selectedItems);
  //console.log(inputId);
  //取出订餐的所有餐品数目，存入inputNum数组
  inputNum=SelectNums(selectedItems);
  //console.log(inputNum);
  //计算无优惠时的价格
  moneyNotPromotion=CalNoPromotion(inputId,inputNum);
  //计算使用优惠1后的价格
  moneyPromotion1=CalPromotion1(moneyNotPromotion);
  //计算使用优惠2后的价格
  moneyPromotion2=CalPromotion2(inputId,inputNum)[0];
  var saveMoney=CalPromotion2(inputId,inputNum)[1];

//输出所订的菜品
  var money=0;
  for(var i=0;i<inputId.length;i++){
    for(var j=0;j<food.length;j++){
      if(inputId[i]==food[j].id){
        money=food[j].price*inputNum[i];
        result+=food[j].name+" x "+inputNum[i]+" = "+money+"元\n";
      }
    }
  }
  result+="-----------------------------------";

//计算哪个promotion更加优惠
  if(moneyPromotion1<moneyPromotion2&&(moneyPromotion1!=0)&&(moneyPromotion2!=0)){
    result+="\n使用优惠:\n满30减6元，省6元\n-----------------------------------";
    result+="\n总计："+moneyPromotion1+"元\n";
    result+="===================================";
  }else if(moneyPromotion1>moneyPromotion2&&(moneyPromotion1!=0)&&(moneyPromotion2!=0)){
    result+="\n使用优惠:\n指定菜品半价(黄焖鸡，凉皮)，省"+saveMoney+"元\n-----------------------------------";
    result+="\n总计："+moneyPromotion2+"元\n";
    result+="===================================";
  }else{
    result+="\n总计："+moneyNotPromotion+"元\n";
    result+="===================================";
  }

  return result;
}

//取出订餐的所有餐品id，存入inputId数组
function SelectId(selectedItems)
{
  var inputId=[];
  for(var i=0;i<selectedItems.length;i++){
    var id=[];
    for(var j=0;j<8;j++){
      id+=selectedItems[i][j];
    }
    inputId[i]=id;
  }


  return inputId;
}

//取出订餐的所有餐品数目，存入inputNum数组
function SelectNums(selectedItems)
{
  var inputNum=[];
  for(var i=0;i<selectedItems.length;i++){
    inputNum[i]=selectedItems[i][11];
  }
  return inputNum;
}

//计算无优惠时的价格
function CalNoPromotion(inputId,inputNum)
{
  var moneyNotPromotion=0;
  var food=loadAllItems();
  /*优化前：
  for(var i=0;i<inputId.length;i++){
    for(var j=0;j<food.length;j++){
      if(inputId[i]==food[j].id){
        moneyNotPromotion+=(food[j].price)*inputNum[i];
      }
    }
  }
  */
  inputId.forEach(function(id1,key){
    //console.log(key);
    //console.log(id1);
    food.forEach(item=>{
      //console.log("******");
      //console.log(item.id);
      if(id1==item.id) {
        //console.log(2);
        moneyNotPromotion += (item.price) * inputNum[key];
      }
    })
  });
  //console.log("+++++",moneyNotPromotion);
  return moneyNotPromotion;
}

//计算使用promotion1的价格
function CalPromotion1(moneyNotPromotion)
{
  var moneyPromotion1=0;
  if(moneyNotPromotion>30){
    moneyPromotion1=moneyNotPromotion-6;
  }
  //console.log("----",moneyPromotion1);
  return moneyPromotion1;
}

//计算使用promotion2的价格
function CalPromotion2(inputId,inputNum)
{
  var food=loadAllItems();
  var moneyPromotion2=0;
  var saveMoney=0;
  var promotion=loadPromotions();
  var result=[];
  /*优化前：
  for(var i=0;i<inputId.length;i++){
    for(var j=0;j<promotion[1].items.length;j++){
      if(inputId[i]==promotion[1].items[j]) {
        for(var j=0;j<food.length;j++){
          if(inputId[i]==food[j].id){
            moneyPromotion2+=(food[j].price)*inputNum[i]/2;
            saveMoney+=(food[j].price)*inputNum[i]/2;
          }
        }
      }
    }
  }
  */
  inputId.forEach(function(a,key1){
    promotion[1].items.forEach(b=>{
      //console.log("//",a);
      //console.log("//",b);
      if(a==b)
      {
        //console.log(1);
        food.forEach(s=>{
          if(a==s.id)
          {
            moneyPromotion2+=s.price*inputNum[key1]/2;
            saveMoney+=s.price*inputNum[key1]/2;
            //console.log(s.price+"*"+inputNum[key1]+"/2"+"=",moneyPromotion2);
          }
        })
      }
    })
  })
  /*优化前：
  for(var i=0;i<inputId.length;i++){
    var n=0;
    for(var j=0;j<promotion[1].items.length;j++){
      if(inputId[i]==promotion[1].items[j]) {
        n=1;
      }
    }
    if(n!=1){
      for(var j=0;j<food.length;j++){
        if(inputId[i]==food[j].id){
          moneyPromotion2+=(food[j].price)*inputNum[i];
        }
      }
    }
  }
  */
  inputId.forEach(function(a,key){
    var n=0;
    //console.log(a);
    promotion[1].items.forEach(b=>{
      //console.log(b);
      if(a==b)
        n=1;
    })
    //console.log("n="+n);
    if(n!=1)
    {
      food.forEach(s=>{
        if(a==s.id)
          moneyPromotion2+=s.price*inputNum[key];
      })
    }
  })
  result.push(moneyPromotion2);
  result.push(saveMoney);
  //console.log(moneyPromotion2);
  //console.log("=======",moneyPromotion2);
  return result;
}
module.exports =  bestCharge;
