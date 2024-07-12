let Page = {
  IsSetup: false,

  body: document.getElementsByTagName('body')[0],
  cvs: document.getElementById('canvas'),
  ctx: 0,

  unitSize: 0,
  AreaArr: [],


  WindowChanged: function () {

    let bodyW = document.documentElement.clientWidth,
      bodyH = document.documentElement.clientHeight,
      newUnitW = (bodyW - (bodyW % 80)) / 16,
      newUnitH = (bodyH - (bodyH % 100)) / 20,
      newUnitMin = Math.max(Math.min(newUnitW, newUnitH), 20);

    this.unitSize = newUnitMin;


    let rightLimit = 0,
      bottomLimit = 0;

    for (let arr of Page.AreaArr) {
      arr.CalculateBounds();

      let newRightLimit = arr.left + arr.W,
        newBottomLimit = arr.top + arr.H;

      rightLimit = Math.max(newRightLimit, rightLimit);
      bottomLimit = Math.max(newBottomLimit, bottomLimit);
    }

    this.cvs.width = rightLimit;
    this.cvs.height = bottomLimit;


    let topPos = (bodyH - bottomLimit) / 2,
      leftPos = (bodyW / 2) - (this.Game.W / 2),
      rightOffset = bodyW - (leftPos + rightLimit) - this.unitSize * 0.5;


    if (rightOffset < 0) {
      leftPos = Math.max(this.unitSize * 0.5, leftPos + rightOffset);
    }

    this.cvs.style.left = leftPos + 'px';
    this.cvs.style.top = topPos + 'px';
  },


  Initialize: function () {


    if (this.IsSetup === false) {
      document.body.appendChild(Page.cvs);

      this.body.style.overflow = 'hidden';
      this.body.style.backgroundColor = 'rgb(19,21,25)';
      this.cvs.style.position = 'absolute';
      this.ctx = this.cvs.getContext('2d');

      this.IsSetup = true;
    }

    this.WindowChanged();


    for (let arr of Page.AreaArr) {
      arr.IsDirty = true;
    }
  },


  Update: function () {
    Page.AreaArr.forEach(area => {
      if (area.IsDirty) {
        area.Draw();
        area.IsDirty = false;
      }
    });
  }
};

function DrawSize(uDrawSize) {
  let projColor = ColorWithAlpha(Player.Pc.Cur.color, 0.1);
  Player.Pc.Cur.UO.arr.forEach((unit) => {

    let drawL = (Player.Pc.Cur.x + unit.x) * Page.unitSize + 1;
    let drawT = (Player.Pc.Cur.y + unit.y) * Page.unitSize + 1;

    Page.ctx.fillStyle = Player.Pc.Cur.color;
    Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);


    if (Player.IsAlive && Player.Pc.ProjY !== 0) {
      drawT += Player.Pc.ProjY * Page.unitSize;

      Page.ctx.fillStyle = projColor;
      Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);
    }
  });
}

function drawFragment(drawL, drawT, uDrawSize) {
    for (let i = 0; i < Player.StaticUnits.length; i++) {
      for (let j = 0; j < Player.StaticUnits[i].length; j++) {


        let uValue = Player.StaticUnits[i][j];


        if (uValue !== 0) {
          drawL = i * Page.unitSize + 1;
          drawT = j * Page.unitSize + 1;


          Page.ctx.fillStyle = (Player.IsAlive) ? uValue : 'rgb(34,36,42)';
          Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);
        }
      }
    }
  }

  function DrawAreaObj(Left, Top, Width, Height, DrawFunction) {


    this.leftBase = Left;
    this.topBase = Top;
    this.widthBase = Width;
    this.heightBase = Height;


    this.left = 0;
    this.top = 0;
    this.W = 0;
    this.H = 0;


    this.IsDirty = false;


    this.CalculateBounds = function () {
      this.left = this.leftBase * Page.unitSize;
      this.top = this.topBase * Page.unitSize;
      this.W = this.widthBase * Page.unitSize;
      this.H = this.heightBase * Page.unitSize;

      this.IsDirty = true;
    };


    this.Draw = DrawFunction;


    Page.AreaArr.push(this);
  }


  Page.Game = new DrawAreaObj(0, 0, 10, 20, function () {


    let uDrawSize = Page.unitSize - 2,
      drawL,
      drawT;


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    drawFragment(drawL, drawT, uDrawSize);


    if (Player.Pc.Cur !== 0 && Player.IsAlive) {
      DrawSize(uDrawSize);
    }


    if (!Player.IsAlive) {
      DrawText("GAME OVER", 'rgb(255,255,255)', '500',
        'center', uDrawSize, this.W / 2, this.H / 4);
    }
  });


  Page.UpcomingA = new DrawAreaObj(10.5, 2.6, 2.5, 2.5, function () {

    let uDrawSize = Math.floor(Page.unitSize / 2),
      pcA = Player.Pc.Upcoming[0];


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    if (pcA !== 0) {
      Page.ctx.fillStyle = pcA.color;

      let totalL = 0,
        totalT = 0,
        countedL = [],
        countedT = [];

      pcA.UO.arr.forEach((unit) => {
        let curX = unit.x,
          curY = unit.y;

        if (countedL.indexOf(curX) < 0) {
          countedL.push(curX);
          totalL += curX;
        }
        if (countedT.indexOf(curY) < 0) {
          countedT.push(curY);
          totalT += curY;
        }
      });

      let avgL = uDrawSize * (totalL / countedL.length + 0.5),
        avgT = uDrawSize * (totalT / countedT.length + 0.5),
        offsetL = this.left + this.W / 2,
        offsetT = this.top + this.H / 2;


      pcA.UO.arr.forEach((unit) => {
        let drawL = Math.floor(offsetL - avgL + unit.x * uDrawSize),
          drawT = Math.floor(offsetT - avgT + unit.y * uDrawSize);

        Page.ctx.fillRect(drawL, drawT, uDrawSize - 1, uDrawSize - 1);
      });
    }
  });


  Page.UpcomingB = new DrawAreaObj(10.5, 5.2, 2.5, 2.5, function () {

    let uDrawSize = Math.floor(Page.unitSize / 2),
      pcB = Player.Pc.Upcoming[1];


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    if (pcB !== 0) {
      Page.ctx.fillStyle = pcB.color;

      let totalL = 0,
        totalT = 0,
        countedL = [],
        countedT = [];

      pcB.UO.arr.forEach((unit) => {
        let curX = unit.x,
          curY = unit.y;

        if (countedL.indexOf(curX) < 0) {
          countedL.push(curX);
          totalL += curX;
        }
        if (countedT.indexOf(curY) < 0) {
          countedT.push(curY);
          totalT += curY;
        }
      });

      let avgL = uDrawSize * (totalL / countedL.length + 0.5),
        avgT = uDrawSize * (totalT / countedT.length + 0.5),
        offsetL = this.left + this.W / 2,
        offsetT = this.top + this.H / 2;


      pcB.UO.arr.forEach((unit) => {
        let drawL = Math.floor(offsetL - avgL + unit.x * uDrawSize),
          drawT = Math.floor(offsetT - avgT + unit.y * uDrawSize);

        Page.ctx.fillRect(drawL, drawT, uDrawSize - 1, uDrawSize - 1);
      });
    }
  });


  Page.UpcomingC = new DrawAreaObj(10.5, 7.8, 2.5, 2.5, function () {

    let uDrawSize = Math.floor(Page.unitSize / 2),
      pcC = Player.Pc.Upcoming[2];


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    if (pcC !== 0) {
      Page.ctx.fillStyle = pcC.color;

      let totalL = 0,
        totalT = 0,
        countedL = [],
        countedT = [];

      pcC.UO.arr.forEach((unit) => {
        let curX = unit.x,
          curY = unit.y;

        if (countedL.indexOf(curX) < 0) {
          countedL.push(curX);
          totalL += curX;
        }
        if (countedT.indexOf(curY) < 0) {
          countedT.push(curY);
          totalT += curY;
        }
      });

      let avgL = uDrawSize * (totalL / countedL.length + 0.5),
        avgT = uDrawSize * (totalT / countedT.length + 0.5),
        offsetL = this.left + this.W / 2,
        offsetT = this.top + this.H / 2;

      pcC.UO.arr.forEach((unit) => {
        let drawL = Math.floor(offsetL - avgL + unit.x * uDrawSize),
          drawT = Math.floor(offsetT - avgT + unit.y * uDrawSize);

        Page.ctx.fillRect(drawL, drawT, uDrawSize - 1, uDrawSize - 1);
      });
    }
  });


  Page.ScoreBarHigh = new DrawAreaObj(10.5, 0, 4.5, 1, function () {


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    let miniUnit, left, top, width, height, text, size;

    miniUnit = Page.unitSize * 0.01;
    Page.ctx.fillStyle = 'rgb(255,232,96)';


    left = Math.floor(this.left + miniUnit * 33);
    top = Math.floor(this.top + this.H - miniUnit * 28);
    width = Math.floor(miniUnit * 30);
    height = Math.floor(miniUnit * 12);
    Page.ctx.fillRect(left, top, width, height);


    left = Math.floor(this.left + miniUnit * 42);
    top = Math.floor(this.top + this.H - miniUnit * 50);
    width = Math.floor(miniUnit * 12);
    height = Math.floor(miniUnit * 32);
    Page.ctx.fillRect(left, top, width, height);


    left = Math.floor(this.left + miniUnit * 48);
    top = Math.floor(this.top + this.H - miniUnit * 68);
    Page.ctx.arc(left, top, miniUnit * 24, 0, Math.PI);
    Page.ctx.fill();


    text = ("00000000" + Player.ScoreHigh).slice(-7);
    left = this.left + this.W - 4;
    top = this.top + Page.unitSize * 0.8;
    size = Math.floor(Page.unitSize * 0.8) + 0.5;

    DrawText(text, 'rgb(255,232,96)', '500', 'right', size, left, top);
  });

  Page.ScoreBarCur = new DrawAreaObj(10.5, 1.1, 4.5, 1, function () {


    Page.ctx.fillStyle = 'rgb(28,30,34)';
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);


    let text, left, top, size, miniUnit;
    miniUnit = Page.unitSize * 0.01;

    text = ('00' + Player.Level).slice(-2);
    left = this.left + Math.floor(miniUnit * 50);
    top = this.top + Page.unitSize * 0.8;
    size = Math.floor(Page.unitSize * 0.5);

    DrawText(text, 'rgb(128,128,128)', '900', 'center', size, left, top);


    text = ("00000000" + Player.ScoreCur).slice(-7);
    left = this.left + this.W - 4;
    top = this.top + Page.unitSize * 0.8;
    size = Math.floor(Page.unitSize * 0.8) + 0.5;

    DrawText(text, 'rgb(255,255,255)', '500', 'right', size, left, top);
  });


  let Player = {

    TimeCur: 0, TimeEvent: 0, TickRate: 0,


    IsAlive: 0, Level: 0, PiecesRemaining: 0,


    ScoreHigh: parseInt(localStorage.getItem('tetris_high_score') || 0), ScoreCur: 0, ScoreBonus: 0, DifficultFlag: 0,

    StaticUnits: [],

    Initialize: function () {


      this.Pc.Next = this.Pc.Cur = this.Pc.ProjY = 0;


      for (let i = 0; i < 10; i++) {
        this.StaticUnits[i] = [];
        for (let j = 0; j < 20; j++) {
          this.StaticUnits[i][j] = 0;
        }
      }


      this.TimeCur = this.TimeEvent = 0;
      this.TickRate = 500;


      this.PiecesRemaining = 10;
      this.Level = 1;


      this.ScoreCur = 0;
      this.IsAlive = true;
    },


    Update: function () {
      this.TimeCur = new Date().getTime();

      if (this.TimeCur >= this.TimeEvent) {

        if (Player.Pc.Cur === 0 && this.IsAlive) {
          this.Pc.Generate();
        }
        else {
          this.Pc.DoGravity();
          this.Pc.ProjY = this.Pc.TryProject();
          Page.Game.IsDirty = true;
        }

        this.RefreshTimer();
      }
    },


    RefreshTimer: function () {
      this.TimeEvent = new Date().getTime() + this.TickRate;
    },


    PieceSpawned: function () {
      this.PiecesRemaining--;
      if (this.PiecesRemaining <= 0) {
        this.AdvanceLevel();
      }
    },


    AdvanceLevel: function () {
      this.Level++;

      this.TickRate = Math.floor(555 * Math.exp(this.Level / -10));
      this.PiecesRemaining = Math.floor((5000 / this.TickRate));

      Page.ScoreBarCur.IsDirty = true;
    },


    CheckUnits: function (checkRowsRaw) {
      let scoreMult = 0,
        pieceScore = 0,
        checkRows = [];

      if (this.ScoreBonus > 0) {
        pieceScore += this.ScoreBonus;
      }

      checkRows = this.getCheckRows(checkRowsRaw);

      for (let checkIndex of checkRows) {
        let hasGap = this.checkForGap(checkIndex);

        if (hasGap === false) {
          this.moveColumns(checkIndex);

          pieceScore += 100 + 200 * scoreMult;
          if (scoreMult > 2) {
            pieceScore += 100;
          }
          scoreMult++;
        }
      }

      if (this.DifficultFlag === 1) {
        pieceScore = Math.floor(pieceScore * 1.5);
        this.DifficultFlag = 0;
      }

      if (pieceScore > 0) {
        this.ScoreCur += pieceScore;
        Page.ScoreBarCur.IsDirty = true;

        this.ScoreBonus = 0;

        if (scoreMult > 3) {
          this.DifficultFlag = 1;
        }
      }

    },

    getCheckRows: (checkRowsRaw) => {
      let checkRows = [];

      for (let a = 0; a < 20; a++) {
        if (checkRowsRaw.indexOf(a) >= 0) {
          checkRows.push(a);
        }
      }

      return checkRows;
    },

    checkForGap: (checkIndex) => {
      for (let column of Player.StaticUnits) {
        if (column[checkIndex] === 0) {
          return true;
        }
      }

      return false;
    },

    moveColumns: (checkIndex) => {
      for (let column of Player.StaticUnits) {
        column.splice(checkIndex, 1);
        column.unshift(0);
      }
    },

    GameOver: function () {
      Page.Game.IsDirty = Page.ScoreBarCur.IsDirty = true;

      if (this.ScoreCur > this.ScoreHigh) {
        this.ScoreHigh = this.ScoreCur;
        localStorage.setItem('tetris_high_score', this.ScoreHigh);
        Page.ScoreBarHigh.IsDirty = true;

      }

      this.IsAlive = false;
    }
  };

  Player.PcObj = function (color, rotCount, units) {
    this.x = 5;
    this.y = 0;
    this.color = color;
    this.UO = {};


    this.Rotate = function () {
      this.UO = this.UO.nextUO;
    };


    this.SetUO = function (rotCount, units) {
      let linkedListUO = [];

      linkedListUO[0] = { nextUO: 0, arr: [] };
      linkedListUO[0].arr = units;

      for (let i = 0; i < rotCount; i++) {

        linkedListUO[i] = { nextUO: 0, arr: [] };

        if (i > 0) {
          linkedListUO[i - 1].nextUO = linkedListUO[i];
        }

        for (let j = 0; j < units.length; j++) {
          let unX,
            unY;

          if (i === 0) {
            unX = units[j].x;
            unY = units[j].y;
          }
          else {
            unX = linkedListUO[i - 1].arr[j].y * -1;
            unY = linkedListUO[i - 1].arr[j].x;
          }

          linkedListUO[i].arr[j] = { x: unX, y: unY };
        }
      }

      linkedListUO[rotCount - 1].nextUO = linkedListUO[0];
      this.UO = linkedListUO[0];
    };
    this.SetUO(rotCount, units);
  };

  Player.O = function () {
    return new Player.PcObj('rgb(255,232,51)', 1,
      [{ x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 }]);
  };

  Player.I = function () {
    return new Player.PcObj('rgb(51,255,209)', 2,
      [{ x: -2, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }]);
  };

  Player.S = function () {
    return new Player.PcObj('rgb(106,255,51)', 2,
      [{ x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 }]);
  };

  Player.Z = function () {
    return new Player.PcObj('rgb(255,51,83)', 2,
      [{ x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }]);
  };

  Player.L = function () {
    return new Player.PcObj('rgb(255,129,51)', 4,
      [{ x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: -1 }]);
  };

  Player.J = function () {
    return new Player.PcObj('rgb(64,100,255)', 4,
      [{ x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -1 }]);
  };

  Player.T = function () {
    return new Player.PcObj('rgb(160,62,255)', 4,
      [{ x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 }]);
  };

  Player.Pc = {
    Cur: 0, ProjY: 0,


    Upcoming: [0, 0, 0],


    Generate: function () {


      this.Cur = this.Upcoming[0];
      this.Upcoming[0] = this.Upcoming[1];
      this.Upcoming[1] = this.Upcoming[2];


      if (this.Cur !== 0) {
        let spawnCollisions = this.CheckCollisions(0, 0, 0);
        if (spawnCollisions > 0) {
          Player.GameOver();
          this.Freeze();
        }
      }


      if (Player.IsAlive !== 0) {
        let randInt = Math.floor(Math.random() * 7);

        switch (randInt) {
          case 0: this.Upcoming[2] = Player.O(); break;
          case 1: this.Upcoming[2] = Player.I(); break;
          case 2: this.Upcoming[2] = Player.S(); break;
          case 3: this.Upcoming[2] = Player.Z(); break;
          case 4: this.Upcoming[2] = Player.L(); break;
          case 5: this.Upcoming[2] = Player.J(); break;
          case 6: this.Upcoming[2] = Player.T(); break;
          default: break;
        }


        if (this.Cur !== 0) {
          Player.PieceSpawned();
          Page.Game.IsDirty = true;
        }

        Page.UpcomingA.IsDirty = Page.UpcomingB.IsDirty =
          Page.UpcomingC.IsDirty = true;
      }
    },


    Freeze: function () {

      if (Player.IsAlive) {
        let affectedRows = [];

        for (const item of this.Cur.UO.arr) {
          let staticX = this.Cur.x + item.x,
            staticY = this.Cur.y + item.y;

          if (staticY >= 0 && staticY <= Player.StaticUnits[0].length) {
            Player.StaticUnits[staticX][staticY] = this.Cur.color;
          }

          if (affectedRows.indexOf(staticY) < 0) {
            affectedRows.push(staticY);
          }
        }


        Player.CheckUnits(affectedRows);
        this.Generate();
      }
    },


    DoGravity: function () {
      if (this.Cur !== 0) {
        let collisions = this.CheckCollisions(0, 0, 1);

        if (collisions === 0) {
          this.Cur.y++;
        }
        else {
          this.Freeze();
        }
      }
      Player.RefreshTimer();
    },


    TryRotate: function () {
      if (this.Cur !== 0) {
        let collisions = this.CheckCollisions(1, 0, 0);

        if (collisions === 0) {
          this.Cur.Rotate();
          return true;
        }
      }
      return false;
    },


    TryMove: function (moveX, moveY) {
      if (this.Cur !== 0) {
        let collisions = this.CheckCollisions(0, moveX, moveY);

        if (collisions === 0) {
          this.Cur.x += moveX;
          this.Cur.y += moveY;

          if (moveY > 0) {
            Player.RefreshTimer();
            Player.ScoreBonus++;
          }
          return true;
        }
      }
      return false;
    },


    TryDrop: function () {
      let squaresDropped = 0;

      if (this.Cur !== 0) {
        while (this.TryMove(0, 1) === true && squaresDropped < 22) {
          squaresDropped++;
        }
      }

      if (squaresDropped > 0) {
        Player.ScoreBonus += 2 * squaresDropped;
        this.Freeze();
        return true;
      }
      else {
        return false;
      }
    },


    TryProject: function () {
      let squaresDropped = 0;

      if (this.Cur !== 0) {
        while (this.CheckCollisions(0, 0, squaresDropped) === 0 &&
          squaresDropped < 22) {
          squaresDropped++;
        }
      }
      return squaresDropped - 1;
    },


    CheckCollisions: function (doRot, offsetX, offsetY) {
      let unitArr,
        collisionCount = 0;

      if (doRot === 1) {
        unitArr = this.Cur.UO.nextUO.arr;
      }
      else {
        unitArr = this.Cur.UO.arr;
      }

      for (const unit of unitArr) {
        let testX = this.Cur.x + unit.x + offsetX,
          testY = this.Cur.y + unit.y + offsetY,
          limitX = Player.StaticUnits.length,
          limitY = Player.StaticUnits[0].length;

        if (testX < 0 || testX >= limitX || testY >= limitY) {
          return -1;
        } else if (testY > 0) {
          if (Player.StaticUnits[testX][testY] !== 0) {
            collisionCount++;
          }
        }
      }

      return collisionCount;
    }
  };
  document.addEventListener('keydown', function (evt) {
    if (Player.IsAlive) {
      switch (evt.key) {
        case 'ArrowUp':
          Page.Game.IsDirty = Player.Pc.TryRotate();
          break;
        case 'ArrowLeft':
          Page.Game.IsDirty = Player.Pc.TryMove(-1, 0);
          break;
        case "ArrowRight":
          Page.Game.IsDirty = Player.Pc.TryMove(1, 0);
          break;
        case 'ArrowDown':
          Page.Game.IsDirty = Player.Pc.TryMove(0, 1);
          break;
        case ' ':
          Page.Game.IsDirty = Player.Pc.TryDrop();
          break;

        default: break;
      }
      if (Page.Game.IsDirty) {
        Player.Pc.ProjY = Player.Pc.TryProject();
      }
    }
    else {
      Init();
    }

  }, false);

  window.onresize = function (event) {
    Page.WindowChanged();
  };


  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  let xDown = null;
  let yDown = null;

  function getTouches(evt) {
    return evt.touches ||
      evt.originalEvent.touches;
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      if (xDiff > 0) {

        Page.Game.IsDirty = Player.Pc.TryMove(-1, 0);
      } else {

        Page.Game.IsDirty = Player.Pc.TryMove(1, 0);
      }
    } else if (yDiff > 0) {
      Page.Game.IsDirty = Player.Pc.TryRotate();
    } else {
      Page.Game.IsDirty = Player.Pc.TryMove(0, 1);
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };



function Init() {
  Page.Initialize();
  Player.Initialize();
}
Init();
function Loop() {
  Page.Update();
  if (Player.IsAlive) {
    Player.Update();
  }
  window.requestAnimationFrame(Loop);
}
Loop();

function DrawText(text, color, weight, alignment, size, left, top) {
  Page.ctx.font = weight + ' ' + size + 'px "Jura", sans-serif';
  Page.ctx.textAlign = alignment;
  Page.ctx.fillStyle = color;
  Page.ctx.fillText(text, left, top);
}


function ColorWithAlpha(color, alpha) {
  let retColor = 'rgba' + color.substring(3, color.length - 1);
  retColor += ',' + alpha + ')';
  return retColor;
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw-tetris.js?v=3')
      .then(reg => console.log("Service Worker Registered"))
      .catch(err => console.log(`Service Worker: Error ${err}`));
  });
}