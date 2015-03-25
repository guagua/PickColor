
var MainLayer = cc.LayerColor.extend({
	init:function () {
		//0:点击开始界面 1:表示等待界面，2:表示在点击界面 3:结果界面 4:Too soon界面
		this.flag = 0;
		this._super();
		this.size = cc.winSize;
		this.setColor(cc.color(180, 170, 160, 255));
		this.showToStart();
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesBegan: function (touches, event) {
				var flag = event.getCurrentTarget().flag;
				cc.log("flag:", event.getCurrentTarget().flag);
				switch(flag)
				{
				case 0:
					event.getCurrentTarget().startDate = new Date();
					event.getCurrentTarget().showGame();
					break;
//				case 1:event.getCurrentTarget().showToSoon();break;
				case 2:
					event.getCurrentTarget().showToStart();break;
				}
			}
		}, this);
		
		this.redColor = new Array(255, 0, 0);
		this.yellowColor = new Array(255, 255, 0);
		this.greenColor = new Array(0, 255, 0);
		this.blueColor = new Array(0, 0, 255);
		this.purpleColor = new Array(139, 0, 255);
//		this.blackColor = new Array(0, 0, 0);
		
		this.allColor = new Array(this.redColor,this.yellowColor,this.greenColor,this.blueColor,this.purpleColor);
		this.allColorText = new Array("红色","黄色","绿色","蓝色","紫色");
		this.selectContent = new Array("选择文字颜色", "选择文字内容");
	},
	
	showToStart:function(){
		this.selectNum = 0;
		this.playTimes = 5;
		this.removeAllChildren();
		cc.eventManager.resumeTarget(this, true); 
		
		this.sprite = new cc.Sprite(res.ClickToStart_png);
		this.sprite.setPosition(this.size.width/2, this.size.height/2);
		this.addChild(this.sprite, 1);
		
		this.startAnim = new cc.Sprite(res.ClickToStartAnim_png);
		this.startAnim.setPosition(this.size.width/2, this.size.height/2);
		this.addChild(this.startAnim, 1);
		
		var action = new cc.Sequence(new cc.FadeOut(1.0),new cc.FadeIn(1.0));
		var rep = new cc.RepeatForever(action);
		this.startAnim.runAction(rep);
		
		this.flag = 0;
	},
	
	showGame:function() {
		cc.eventManager.pauseTarget(this, true); 
		var randomNum1 = Math.floor(Math.random()*5);
		var randomNum2 = Math.floor(Math.random()*5);
		while(randomNum1 == randomNum2) {
			randomNum2 = Math.floor(Math.random()*5);
		}
		this.removeAllChildren(true);
		this.textLabel = new cc.LabelTTF(this.allColorText[randomNum2], "微软雅黑",50);
		this.textLabel.setColor(cc.color(this.allColor[randomNum1][0], this.allColor[randomNum1][1], this.allColor[randomNum1][2]));
		this.textLabel.setPosition(this.size.width/2,this.size.height*2/3);
		this.addChild(this.textLabel,2);
		
		var randomContent = Math.floor(Math.random()*10)%2;
		this.contentLabel = new cc.LabelTTF(this.selectContent[randomContent], "微软雅黑",55);
		this.contentLabel.setColor(cc.color(255, 0, 0, 255));
		this.contentLabel.setPosition(this.size.width/2, this.size.height*2/3 + 80);
		this.addChild(this.contentLabel, 2);
		
		var labelNum = "你已经闯过了" + this.selectNum + "/" + this.playTimes + "关";
		this.selectNumLabel = new cc.LabelTTF(labelNum, "微软雅黑",30);
		this.selectNumLabel.setColor(cc.color(255, 255, 0, 255));
		this.selectNumLabel.setAnchorPoint(0, 0);
		this.selectNumLabel.setPosition(30, this.size.height*2/3 + 120);
		this.addChild(this.selectNumLabel, 2);
		
		//显示底部按钮
		var randomNum3 = Math.floor(Math.random()*10)%2;
		var tmp1 = 1;
		var tmp2 = 2;
		if((randomNum3 == 0 && randomContent == 0) || (randomNum3 == 1 && randomContent == 0))
		{
			tmp1 = 1;
			tmp2 = 2;
		}else if((randomNum3 == 0 && randomContent == 1) || (randomNum3 == 1 && randomContent == 1))
		{
			tmp1 = 2;
			tmp2 = 1;
		}
		
		var rightBtn = new cc.MenuItemImage(res.BTN_png, res.BTN_png, function() {
			if (this.selectNum == (this.playTimes - 1)) {
				this.showResult(1);
			} else {
				this.selectNum++;
				this.showGame(1);
			}
			return true;
		}, this);
		
		var rightNum = randomNum1;
		var errorNum = randomNum2;
		if (randomContent == 1) {
			rightNum = randomNum2;
			errorNum = randomNum1;
		}
		rightBtn.setColor(cc.color(this.allColor[rightNum][0], this.allColor[rightNum][1], this.allColor[rightNum][2]));
		rightBtn.setAnchorPoint(0.5, 0.5);
		rightBtn.setPosition(this.size.width*tmp1/3,this.size.height/3);

		var errorBtn = new cc.MenuItemImage(res.BTN_png, res.BTN_png, function() { 
			this.showResult(0);
			return true;
		},this);
		errorBtn.setAnchorPoint(0.5, 0.5);
		errorBtn.setColor(cc.color(this.allColor[errorNum][0], this.allColor[errorNum][1], this.allColor[errorNum][2]));
		errorBtn.setPosition(this.size.width*tmp2/3,this.size.height/3);
		var menu = new cc.Menu(rightBtn,errorBtn);

		menu.setPosition(0,0);
		this.addChild(menu, 1);
	},
	
	showResult:function(tag)
	{
		cc.eventManager.resumeTarget(this, true);
		this.removeAllChildren();
		var str;

		this.endDate = new Date();//记录点击时间
		time = this.endDate.getTime() - this.startDate.getTime();
		this.sprite = new cc.Sprite(res.Result_png);
		this.sprite.setPosition(this.size.width/2,this.size.height/2);
		this.addChild(this.sprite,1);
		if(tag == 1)
		{
			var beatRate = 0;
			if (time > 5000) {
				if (time >= 20000) time = 20000;
				beatRate = (20000 - time)/300;
			} else {
				if (time <= 1000) time = 1000;
				beatRate = 50 + (5000 - time) / 80;
			}
			var finalTime = time/1000
			str = finalTime.toFixed(2) +"s\n" + "恭喜你，打败了全国" + beatRate.toFixed(2) + "%的玩家！";
		}else
		{
			str = "亲，选错啦，再试试吧!";
		}

		cc.log("showResult",time);
		this.timeLabel = new cc.LabelTTF(str,"Arial",30);
		this.timeLabel.setColor(cc.color(255,255,255));
		this.timeLabel.setPosition(this.size.width/2,this.size.height/2)
		this.addChild(this.timeLabel,1);

		this.resultAnim = new cc.Sprite(res.ResultAnim_png);
		this.resultAnim.setPosition(this.size.width/2,this.size.height/2-200);
		this.addChild(this.resultAnim,1);
		var action = new cc.Sequence(new cc.FadeOut(1.0),new cc.FadeIn(1.0));
		var rep = new cc.RepeatForever(action);
		this.resultAnim.runAction(rep);

//		document.title = window.wxData.desc = "我的反应速度是"+time+"ms!来试试你的吧！";
		this.flag = 2;
	}
	
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        layer.init();
        this.addChild(layer);
    }
});

