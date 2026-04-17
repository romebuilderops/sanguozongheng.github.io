import React from 'react';
import { BookOpen, Swords, Shield, Zap, Flame, Droplet, Star, Sparkles, Bomb, X } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-amber-500 mb-8 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          游戏帮助
        </h1>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Swords className="w-6 h-6" />
            游戏规则
          </h2>
          <div className="space-y-3 text-slate-300">
            <p>《三国纵横消战天下》是一款结合三消战斗策略的RPG游戏。玩家需要通过消除棋子来攻击敌人、积累能量并释放技能。</p>
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-amber-300 mb-2">基本玩法</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>交换相邻棋子，使3个或以上相同颜色的棋子连成一线进行消除</li>
                <li>消除红色棋子：对敌人造成伤害</li>
                <li>消除绿色棋子：回复玩家生命值</li>
                <li>消除黄色棋子：增加将领能量</li>
                <li>消除蓝色棋子：获得护盾（减少受到的伤害）</li>
                <li>消除紫色棋子：增加将领能量</li>
                <li>消除橙色棋子：恢复粮草（特殊资源）</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-amber-300 mb-2">战斗流程</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>每回合玩家可以进行一次棋子交换操作</li>
                <li>消除棋子后会对敌人造成伤害并获得能量</li>
                <li>能量达到要求时，可以点击将领头像释放技能</li>
                <li>敌人会在玩家行动后进行攻击</li>
                <li>击败敌人即可通关</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            棋子作用
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-red-400">红色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">攻击棋子，消除后对敌人造成伤害</p>
            </div>
            
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-green-400">绿色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">生命棋子，消除后回复玩家生命值</p>
            </div>
            
            <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-yellow-400">黄色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">士气棋子，消除后增加技能能量</p>
            </div>
            
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-blue-400">蓝色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">防御棋子，消除后获得护盾效果</p>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-purple-400">紫色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">谋略棋子，消除后增加谋略能量</p>
            </div>
            
            <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-orange-400">橙色棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">粮草棋子，消除后恢复粮草资源</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Bomb className="w-6 h-6" />
            特殊棋子
          </h2>
          <div className="space-y-3">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-amber-300">强化棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">通过消除4个相同颜色的棋子生成。消除强化棋子时，会对周围3x3范围内的棋子造成额外伤害。</p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bomb className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-red-300">炸弹棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">通过消除5个相同颜色的棋子生成。消除炸弹棋子时，会炸毁整个棋盘上所有相同颜色的棋子。</p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <X className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-300">十字消除棋子</h3>
              </div>
              <p className="text-slate-300 text-sm">通过消除T型或L型的棋子生成。消除十字棋子时，会消除整行和整列的棋子。</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Swords className="w-6 h-6" />
            BOSS技能
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
              <h3 className="font-bold text-purple-400 mb-2">魔张宝（地公将军）</h3>
              <p className="text-slate-300 text-sm mb-2">第5关精英BOSS</p>
              <div className="bg-slate-700 rounded-lg p-3 mb-3">
                <h4 className="font-bold text-amber-300 mb-1">技能：魔·妖术</h4>
                <p className="text-slate-300 text-sm">每4回合释放，将棋盘上3个随机棋子变为黑色棋子（无法消除，持续1回合）。</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <h4 className="font-bold text-amber-300 mb-1">技能：魔·地公将军</h4>
                <p className="text-slate-300 text-sm">当生命值低于40%时，每回合有50%概率释放，对玩家造成150点伤害并随机消除玩家5点能量。</p>
              </div>
            </div>
            
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
              <h3 className="font-bold text-red-400 mb-2">魔张角（太平要术）</h3>
              <p className="text-slate-300 text-sm mb-2">第10关BOSS</p>
              <div className="bg-slate-700 rounded-lg p-3 mb-3">
                <h4 className="font-bold text-amber-300 mb-1">技能：魔·妖术</h4>
                <p className="text-slate-300 text-sm">每3回合释放，将棋盘上3个随机棋子变为黑色棋子（无法消除，持续1回合）。</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 mb-3">
                <h4 className="font-bold text-amber-300 mb-1">技能：魔·天公将军</h4>
                <p className="text-slate-300 text-sm">当生命值低于50%时，每2回合释放，对玩家造成200点伤害并使玩家下回合消除棋子获得的能量减少50%。</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <h4 className="font-bold text-amber-300 mb-1">技能：魔·黄天当立</h4>
                <p className="text-slate-300 text-sm">当生命值低于20%时，每回合释放，回复自身10%最大生命值并对玩家造成150点伤害。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            主公被动技能
          </h2>
          <div className="space-y-3">
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
              <h3 className="font-bold text-blue-400 mb-1">曹操 - 护盾积累</h3>
              <p className="text-slate-300 text-sm">每消除10个蓝色棋子，获得1层护盾（每层减伤5%，上限4层）</p>
            </div>
            
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
              <h3 className="font-bold text-green-400 mb-1">刘备 - 生命回复</h3>
              <p className="text-slate-300 text-sm">每消除10个绿色棋子，回复5%生命</p>
            </div>
            
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
              <h3 className="font-bold text-red-400 mb-1">孙权 - 火焰伤害</h3>
              <p className="text-slate-300 text-sm">每消除10个红色棋子，对随机敌人造成50%攻击力的火焰伤害</p>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
              <h3 className="font-bold text-purple-400 mb-1">董卓 - 技能增伤</h3>
              <p className="text-slate-300 text-sm">每消除10个紫色棋子，下次技能伤害+30%</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6" />
            关卡类型
          </h2>
          <div className="space-y-3">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-bold text-slate-300 mb-1">普通关卡</h3>
              <p className="text-slate-400 text-sm">标准战斗关卡，击败敌人即可通关</p>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
              <h3 className="font-bold text-purple-400 mb-1">精英关卡</h3>
              <p className="text-slate-300 text-sm">难度较高的关卡，敌人属性更强，但奖励更丰厚</p>
            </div>
            
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
              <h3 className="font-bold text-red-400 mb-1">BOSS关卡</h3>
              <p className="text-slate-300 text-sm">章节最终关卡，面对强大的BOSS敌人，通关后获得大量奖励</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}