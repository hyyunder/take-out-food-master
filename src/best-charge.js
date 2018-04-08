function bestCharge(selectedItems) {
  var result="============= 订餐明细 =============\n";
  var inputId=[];
  var inputNum=[];
  var food=loadAllItems();
  var promotion=loadPromotions();
  //取出订餐的所有餐品id，存入inputId数组
  for(var i=0;i<selectedItems.length;i++){
    var id=[];
    for(var j=0;j<8;j++){
      id+=selectedItems[i][j];
    }
    inputId[i]=id;
  }
//取出订餐的所有餐品数目，存入inputNum数组
  for(var i=0;i<selectedItems.length;i++){
    inputNum[i]=selectedItems[i][11];
  }

//计算无优惠时的价格
  var moneyNotPromotion=0;
  for(var i=0;i<inputId.length;i++){
    for(var j=0;j<food.length;j++){
      if(inputId[i]==food[j].id){
        moneyNotPromotion+=(food[j].price)*inputNum[i];
      }
    }
  }

//计算使用promotion1的价格
  var moneyPromotion1=0;
  if(moneyNotPromotion>30){
    moneyPromotion1=moneyNotPromotion-6;
  }

//计算使用promotion2的价格
  var moneyPromotion2=0;
  var saveMoney=0;
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
