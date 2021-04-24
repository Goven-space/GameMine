class Mine {
    constructor(trNums, tdNums, mineNums) {
        this.trNums = trNums//行数
        this.tdNums = tdNums//列数
        this.mineNums = mineNums//地雷数
        this.squareArr = [] //总格子二维数组
        this.eleArr = []

        this.total = trNums * tdNums//格子总数
        this.parent = document.querySelector('.wrapper')
    }
    //创建元素
    createDom() {
        var self = this
        var table = document.createElement('table')
        //取消右键打开菜单
        table.oncontextmenu = function () {
            return false
        }
        for (let i = 0; i < this.trNums; i++) {
            var tr = document.createElement('tr')
            this.eleArr[i] = []
            for (let j = 0; j < this.tdNums; j++) {
                var td = document.createElement('td')
                td.pos = [j, i]
                td.onmousedown = function (e) {
                    self.play(e, this)
                }
                this.eleArr[i][j] = td
                tr.appendChild(td)


            }
            table.appendChild(tr)
        }
        var wrapper = document.querySelector('.wrapper')
        this.parent.appendChild(table)
    }
    //随机生成地雷位置
    randomNum() {
        var square = new Array(this.total)
        for (let i = 0; i < square.length; i++) {
            square[i] = i
        }
        square.sort(function () {
            return 0.5 - Math.random()
        })
        return square.slice(0, this.mineNums)
    }
    init() {
        this.createDom()
        var mineList = this.randomNum()
        var n = 0
        for (let i = 0; i < this.trNums; i++) {
            this.squareArr[i] = []
            for (let j = 0; j < this.tdNums; j++) {
                if (mineList.indexOf(n++) != -1) {
                    this.squareArr[i][j] = {
                        type: "mine",
                        x: j,
                        y: i
                    }
                } else {
                    this.squareArr[i][j] = {
                        type: "number",
                        x: j,
                        y: i,
                        value: 0
                    }
                }
            }
        }
        this.updateNum()

    }
    //更新每个格子的数字
    updateNum() {
        for (let i = 0; i < this.trNums; i++) {
            for (let j = 0; j < this.tdNums; j++) {
                if (this.squareArr[i][j].type == "mine") {
                    var around = this.around(j, i)
                    for (let k = 0; k < around.length; k++) {
                        var item = this.squareArr[around[k][0]][around[k][1]]
                        if (item.type == "number") {
                            item.value++
                        }
                    }
                }
            }
        }
        console.log(this.squareArr)
    }
    around(x, y) {
        let aroundArr = []

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i < 0 || i > this.tdNums - 1 || j < 0 || j > this.trNums - 1 || (i == x && j == y)) {
                    continue
                }
                aroundArr.push([j, i])

            }
        }
        return aroundArr
    }

    play(env, obj) {
        var cl = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"]
        var self = this
        //显示格子
        function show(state, ele) {
            if (!state.check) {
                state.check = true
                if (state.value === 0) {
                    ele.classList.add('zero')
                    var around = self.around(state.x, state.y)
                    for (var value of around) {
                        if (!self.eleArr[value[0]][value[1]].classList.contains('flag')) {
                            show(self.squareArr[value[0]][value[1]], self.eleArr[value[0]][value[1]])
                        }

                    }
                } else {
                    ele.classList.add(cl[state.value])
                    ele.innerHTML = state.value
                }


            }
        }
        var state = this.squareArr[obj.pos[1]][obj.pos[0]]
        // 点击鼠标左键
        if (env.which == 1) {
            var ele = this.eleArr[state.y][state.x]
            if (state.type == "mine") {
                ele.classList.add('bomb')
                for (let i = 0; i < this.trNums; i++) {
                    for (let j = 0; j < this.tdNums; j++) {
                        var square = this.squareArr[i][j]

                        if (square.type == "mine") {
                            this.eleArr[i][j].classList.add('mine')
                        }
                        this.eleArr[i][j].onmousedown = null
                    }
                }
                setTimeout(() => {
                    alert("Game Over")
                },0)
            }
            if (!obj.classList.contains('flag')) {
                if (state.type == "number") {
                    show(state, ele)
                }
            }

        } else if (env.which == 3) {
            if (!state.check) {
                if (obj.classList.contains('flag')) {
                    obj.classList.remove('flag')
                } else {
                    obj.classList.add('flag')
                }
            }


        }
    }
}
var mine = new Mine(15, 15, 22)
mine.init()