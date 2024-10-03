const DefProgram_nav = `
BUTTON HomeButton:
	color = 'gray'
	width = 100
	height = 50
	text = 'Home'
	onclick = open(Main.view)

BUTTON AboutButton:
	color = c
	width = 100
	height = 50
	disabled = false
	text = 'About'
	onclick = open(About.view)

CONTAINER NavBar:
	width = 200
	height = 50
	borderstyle = 'solid'
	bordercolor = 'black'
	borderwidth = 1
	direction = 'row'

HomeButton AS hb
AboutButton WITH c='red' AS ab

NavBar WITH components=[hb, ab] AS nb
`;

const DefProgram_changePic = `
PICTURE DynamicPicture:
	url = s

BUTTON Btn:
	color = "gray"
	text = "Home"
	onclick = [set(DynamicPicture.width, DynamicPicture.width * 2), set(HeyText.fontsize, 14), open(About.view)]

TEXT HeyText:
	text = 'Hey'

DynamicPicture WITH s = "https://google.com" AS coolPic
HeyText AS myText
HeyText AS myTextAgain
Btn WITH pic = coolPic, t = myText, diffPic = coolPic AS myBtn
`;

export const DefExamples = {
    DefProgram_nav,
	DefProgram_changePic,
};
