import type { DescriptionSection, SectionKind } from '../models/character';
import type { CharacterId } from './names';

export const SECTION_TITLES: Record<SectionKind, string> = {
  general: $localize`:@@section.general:General`,
  hintForTheNarrator: $localize`:@@section.hintForTheNarrator:Hint for the narrator`,
  attention: $localize`:@@section.attention:Attention`,
  variantForTheBrave: $localize`:@@section.variantForTheBrave:Variant for the brave`,
  hint: $localize`:@@section.hint:Hint`,
  specialCase: $localize`:@@section.specialCase:Special case`,
  explanations: $localize`:@@section.explanations:Explanations`,
};

function section(kind: SectionKind, description: string): DescriptionSection {
  return { kind, title: SECTION_TITLES[kind], description };
}

export const CHARACTER_DESCRIPTIONS = {
  angel: [
    section(
      'general',
      $localize`:@@character.angel.general:When the Angel is in play, the game opens with a day and its vote, before the first night falls and before any special character is called. If the Angel draws the village's suspicion in that vote, or is devoured by the werewolves during the first night, they win the game outright and the narrator may start a new round straight away. If they survive both, the Angel becomes an ordinary villager for the rest of the game.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.angel.hintForTheNarrator:Do not be shy about reminding the village that the Angel might be among them. The first discussion is livelier for it, and a smooth talker has a heavenly threat to hide behind.`,
    ),
  ],
  bear_tamer: [
    section(
      'general',
      $localize`:@@character.bear_tamer.general:Every morning, straight after the night's victims are announced, the narrator growls like a bear if either of the Bear Tamer's neighbours is a werewolf. Only players still in the game count as neighbours.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.bear_tamer.hintForTheNarrator:The game is easier to run if eliminated players leave the circle rather than staying in their seats. If the Bear Tamer has been infected by the Primal Wolf, growl every morning until the Bear Tamer is eliminated.`,
    ),
  ],
  big_wolf: [
    section(
      'general',
      $localize`:@@character.big_wolf.general:Each night the Big Bad Wolf wakes with the other wolves and helps choose a victim. Then, as long as no werewolf has been eliminated, including the Wild Child or the Wolfdog once they have turned, the Big Bad Wolf wakes a second time alone, straight after the wolf phase, and chooses another victim. They may not devour a werewolf.`,
    ),
  ],
  bitter_old_man: [
    section(
      'general',
      $localize`:@@character.bitter_old_man.general:Before the game starts, the narrator splits the village into two groups and announces the split out loud, going by something obvious: gender, glasses, height, age, a beard. The Bitter Old Man has to fall clearly into one of the two groups. They win the game alone, and only this way, if every player in the other group is eliminated. No special ability helps them do it. Talk and manipulation are their only weapons.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.bitter_old_man.hintForTheNarrator:The two groups do not have to be the same size. If anyone looks unsure, tell every player plainly which group they are in.`,
    ),
  ],
  brothers: [
    section(
      'general',
      $localize`:@@character.brothers.general:The Three Brothers are ordinary villagers and pull in the same direction as the rest of the village. On the first night the narrator calls them so they can learn who the others are. With experienced groups the narrator can wake them again now and then, every second night or whenever it suits, to let them agree quietly on what to do next.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.brothers.hintForTheNarrator:Like the Two Sisters, the Three Brothers are a powerful thing in the hands of players who can sign to each other. Use them only in large groups. In very large ones it is worth adding the Two Sisters as well.`,
    ),
  ],
  cupid: [
    section(
      'general',
      $localize`:@@character.cupid.general:On the first night Cupid picks the two players who fall in love, in any combination, and may pick themselves as one of the two. If one lover is eliminated, the other dies of grief and is eliminated at once. A lover may never vote against their partner or harm them in any way, not even as a bluff.`,
    ),
    section(
      'specialCase',
      $localize`:@@character.cupid.specialCase:If one lover is a werewolf and the other a villager, the pair get a goal of their own: to survive together they must see every other player eliminated, villagers and werewolves alike, while still playing by the rules.`,
    ),
  ],
  elder: [
    section(
      'general',
      $localize`:@@character.elder.general:The Elder has come through every trial life could throw at them and is harder to kill than anyone else in the village. The werewolves have to choose them twice. The first time the wolves tear into them, the Elder survives and the narrator does not turn their card over. The Primal Wolf cannot infect them with that first bite either. Only a second attack eliminates them. A village vote, the Witch's poison, the Hunter's shot or the Barber's razor all take the Elder at the first attempt, and if they go that way the villagers lose their special abilities in despair at having killed so learned an elder.`,
    ),
    section(
      'attention',
      $localize`:@@character.elder.attention:If the Witch heals the Elder, they get only one life back.`,
    ),
    section(
      'variantForTheBrave',
      $localize`:@@character.elder.variantForTheBrave:If the Village Idiot has already been revealed, the Idiot is eliminated along with the Elder. The village, having lost its wisdom, goes back on the decision to spare the Idiot.`,
    ),
  ],
  fox: [
    section(
      'general',
      $localize`:@@character.fox.general:When the narrator calls the Fox at night, the Fox may point at one player to choose that player and both of their neighbours. If at least one werewolf is among those three, the narrator confirms it and the Fox keeps the ability for the following night. If none of the three is a werewolf, the Fox loses the ability for good, but now knows three players who are above suspicion.`,
    ),
    section(
      'hint',
      $localize`:@@character.fox.hint:The narrator calls the Fox every night, but the Fox does not have to use the ability every night.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.fox.hintForTheNarrator:Never show the Fox the cards of the three players. They learn only whether at least one werewolf is among them.`,
    ),
  ],
  healer: [
    section(
      'general',
      $localize`:@@character.healer.general:When the narrator calls the Healer, before the werewolves, the Healer points at one player. That player is protected from the werewolves for that night only. If the wolves choose them as their victim, they are not eliminated.`,
    ),
    section(
      'attention',
      $localize`:@@character.healer.attention:The Healer may protect themselves, but may not protect the same player on two nights in a row. The protection does nothing for the Little Girl, who is deep in a teenage crisis and will go looking for trouble whatever anyone does. It is also no defence against the Piper or against infection by the Primal Wolf.`,
    ),
  ],
  hoodrat: [
    section(
      'general',
      $localize`:@@character.hoodrat.general:When the narrator calls the Hoodrat, before the werewolves, the Hoodrat may choose to spend the night at another player's house. If the werewolves come for that player, they find the Hoodrat there too, and both die. If the werewolves come for the Hoodrat while they are out, the Hoodrat is spared.`,
    ),
    section(
      'attention',
      $localize`:@@character.hoodrat.attention:The Hoodrat may also stay at home, and may not spend two nights in a row at the same player's house. Protection works on the house, potions on the person. If the Healer protects the host, the wolves cannot get in and both survive, but protecting the Hoodrat only guards their own empty house. The Witch's healing potion saves only the player it is given to, so healing the host does not save the Hoodrat. Where they slept matters only to the wolves: the poison, the Hunter's shot and the village vote reach the Hoodrat and the host separately.`,
    ),
  ],
  hunter: [
    section(
      'general',
      $localize`:@@character.hunter.general:If the Hunter is devoured by the werewolves or executed by the village, they get one shot before they go. They name any player, and that player is eliminated as well.`,
    ),
    section(
      'specialCase',
      $localize`:@@character.hunter.specialCase:If the Hunter is in love with a player who is eliminated, they may still name someone before dying of grief, and that player is eliminated too. This can end with nobody left alive at all, in which case no side has won.`,
    ),
  ],
  judge: [
    section(
      'general',
      $localize`:@@character.judge.general:Once per game the Stuttering Judge may call for a second vote on the same day, with a second victim. They signal this to the narrator during the first vote, using a sign the two of them agreed beforehand. The second vote follows immediately, with no further discussion. The sign itself is agreed with the narrator when the Judge is called on the first night.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.judge.hintForTheNarrator:Watch the Stuttering Judge closely so you do not miss the sign.`,
    ),
  ],
  juggler: [
    section(
      'general',
      $localize`:@@character.juggler.general:Before the game the narrator picks three characters with special abilities and lays them face up in the middle of the table once the roles have been dealt. Each night, when called, the Juggler chooses one of those cards and plays as that character until the next night. The chosen card is then taken out of the display and out of the game.`,
    ),
    section(
      'attention',
      $localize`:@@character.juggler.attention:No wolf may be put in the display.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.juggler.hintForTheNarrator:The cards you offer the Juggler are a lever on the whole game. Use them to stir up trouble, or to give the village a chance against a strong pack. If the Thief is also in play, lay out the Thief's two cards first and the Juggler's three afterwards.`,
    ),
  ],
  knight: [
    section(
      'general',
      $localize`:@@character.knight.general:If the Knight is devoured they are eliminated, but the rusty blade wounds one of the wolves that took them. Of the guilty wolves, the one sitting nearest to the Knight's left survives the day and dies of the wound the following night. The narrator announces that death the morning after it happens.`,
    ),
    section(
      'hint',
      $localize`:@@character.knight.hint:Sharp players can work out from this that everyone sitting between the Knight and the poisoned werewolf is an innocent villager.`,
    ),
  ],
  maid: [
    section(
      'general',
      $localize`:@@character.maid.general:Before the narrator reveals the card of a player the village has just voted out, the Devoted Maid may reveal themselves by turning their own card face up. The Maid then gives up that card and takes the eliminated player's character instead. The new character is not shown to the rest of the village, and it stays with the former Maid until they are eliminated or the game ends.`,
    ),
    section(
      'attention',
      $localize`:@@character.maid.attention:A Maid who is one of the lovers does not get this choice. Love is stronger than the wish to change character.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.maid.hintForTheNarrator:Take your time before showing the village an eliminated player's card, so the Maid has room to reveal themselves. If they take on a character with a night ability, call them for it on the following nights, and on the first night after the swap prompt them quietly so they can settle into the role. Every special ability of the character the Maid takes over is refreshed and played as though it were the first night, and any effect that was on the eliminated player is cancelled.`,
    ),
    section(
      'explanations',
      $localize`:@@character.maid.explanations:The Maid inherits none of the following from the eliminated player: infection, being in love, enchantment, the office of Captain or Beadle, or Cupid's role. A Maid who was enchanted, Captain or Beadle stops being so. A Maid who was infected stays infected. A Maid who becomes the Piper is told by the narrator which players are already enchanted. A Maid who becomes the Juggler, the Beadle or the Gypsy gets no new cards dealt, and carries on with whichever cards are still unused.`,
    ),
  ],
  piper: [
    section(
      'general',
      $localize`:@@character.piper.general:Each night, when the narrator calls them, the Piper picks two players and the narrator touches those players on the shoulder. The Piper goes back to sleep. The narrator then wakes everyone who is enchanted, new and old, so they can see one another, and sends them back to sleep. As soon as no unenchanted player is left alive, the Piper wins against everyone else, even if the last one was removed by a village vote or by the wolves.`,
    ),
    section(
      'attention',
      $localize`:@@character.piper.attention:The Piper cannot enchant themselves. The Healer's protection does not stop an enchantment and the Witch cannot cure one. Werewolves are not immune to it. Enchanted players keep all their abilities and traits. Enchantment does not pass between lovers.`,
    ),
  ],
  primal_wolf: [
    section(
      'general',
      $localize`:@@character.primal_wolf.general:Each night the Primal Wolf wakes with the other wolves and helps choose a victim. Once the wolves are asleep again, the Primal Wolf may signal to the narrator that they want to infect that night's victim. This works only once per game. The narrator touches the infected player, who becomes a werewolf on the spot and from the next night on wakes with the pack to hunt. If that player has a night ability of their own, they still wake for it when called, on top of the wolf phase.`,
    ),
  ],
  scapegoat: [
    section(
      'general',
      $localize`:@@character.scapegoat.general:If the village vote ends in a tie, the Scapegoat is eliminated instead of either of the tied players, so it is on them to steer the day away from that ending. A Scapegoat who is eliminated keeps one privilege: they decide who may vote the next day and who may not.`,
    ),
    section(
      'attention',
      $localize`:@@character.scapegoat.attention:Naming a single voter risks the werewolves devouring that player the following night, which would leave the village with no vote at all. Unless, of course, the chosen player is a werewolf, or the wolves leave them alive on purpose.`,
    ),
  ],
  seer: [
    section(
      'general',
      $localize`:@@character.seer.general:Each night the Seer learns the true identity of one player of their choice. They have to help the rest of the village with what they know without giving themselves away, or the werewolves will find them.`,
    ),
  ],
  sisters: [
    section(
      'general',
      $localize`:@@character.sisters.general:The Two Sisters are ordinary villagers and pull in the same direction as the rest of the village. The narrator calls them on the first night so they can recognise each other. With experienced groups they can be woken again now and then, every second night or whenever the narrator likes, to agree quietly on how to save the village.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.sisters.hintForTheNarrator:The Two Sisters are a powerful thing in the hands of players who can sign to each other.`,
    ),
  ],
  small_child: [
    section(
      'general',
      $localize`:@@character.small_child.general:The Little Girl may spy on the werewolves through half-closed eyes during the wolf phase. If the wolves notice, they may devour the Little Girl on the spot, silently, in place of the victim they had chosen. The Little Girl may only spy while the werewolves are awake, and must never open their eyes wide to pass as one of the pack.`,
    ),
  ],
  thief: [
    section(
      'general',
      $localize`:@@character.thief.general:To play with the Thief, add two extra Simple Villager cards to the deck before the game begins. Once the roles are dealt, the two cards left over go face down in the middle of the table. On the first night the Thief looks at both and may swap their own card for one of them. If both are werewolves, the Thief must take one of them. Whatever they end up with is theirs for the rest of the game.`,
    ),
  ],
  village_idiot: [
    section(
      'general',
      $localize`:@@character.village_idiot.general:What village does not have its idiot? They make a nuisance of themselves, but they are so likeable that nobody could bring themselves to do them harm. If the village votes the Village Idiot out, the Idiot turns their card over, the villagers see their mistake and pardon them on the spot. The Idiot plays on but loses the right to vote from then on, because who listens to an idiot anyway, and there is no fresh vote that day. The pardon only covers the village vote. If the werewolves devour the Idiot, they are eliminated. If the Idiot was Captain, that office is lost for good. If the Hunter shoots the Idiot, they are eliminated.`,
    ),
  ],
  villager: [
    section(
      'general',
      $localize`:@@character.villager.general:The Simple Villager has no special ability. Their only weapons are a sharp eye for suspicious behaviour and the knack of talking the rest of the village round to their innocence.`,
    ),
  ],
  werewolf: [
    section(
      'general',
      $localize`:@@character.werewolf.general:Every night the werewolves devour a villager. By day they try to keep their true identity hidden. A werewolf may never devour another werewolf.`,
    ),
  ],
  white_wolf: [
    section(
      'general',
      $localize`:@@character.white_wolf.general:The White Wolf hates the werewolves as much as the villagers. Every night they wake with the pack and help pick a victim from the village. Every second night, though, the narrator calls the White Wolf alone in a phase of their own, and they may kill one werewolf if they wish. They may not take a second villager. The White Wolf wins only by being the last player left alive.`,
    ),
  ],
  wild_child: [
    section(
      'general',
      $localize`:@@character.wild_child.general:The Wild Child starts as a villager. On the first night the narrator calls them and they silently choose a role model. If that role model is killed at any point, the Wild Child turns their back on the village and goes back to the wolves, waking with the pack every night from then on. While the role model lives the Wild Child stays a villager, even if the role model turns out to be a werewolf. The Wild Child may help eliminate their own role model if they want to. If the role model is still alive when the last wolf is eliminated, the Wild Child wins with the village. If the role model is gone and the wolves win, the Wild Child shares that victory instead.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.wild_child.hintForTheNarrator:It adds to the tension to keep the Wild Child's true identity secret if the village votes them out, so nobody knows whether a villager or a werewolf was eliminated.`,
    ),
  ],
  witch: [
    section(
      'general',
      $localize`:@@character.witch.general:The Witch can brew two very powerful potions: a healing potion that saves a player the werewolves have chosen as their victim, and a poison that kills any player of their choice during the night. Each potion may be used once per game, and both may be used on the same night. The Witch may also use the healing potion on themselves.`,
    ),
  ],
  wolfdog: [
    section(
      'general',
      $localize`:@@character.wolfdog.general:On the first night the Wolfdog decides which side to play on: Simple Villager or Simple Werewolf. If they choose the wolves, they simply open their eyes with the rest of the pack during the wolf phase and hunt with them. Otherwise they keep their eyes shut and play for the village. The choice is final and holds for the rest of the game.`,
    ),
    section(
      'hintForTheNarrator',
      $localize`:@@character.wolfdog.hintForTheNarrator:As with the Wild Child, it adds to the tension to keep the Wolfdog's true identity secret if the village votes them out, so nobody knows whether a villager or a werewolf was eliminated.`,
    ),
  ],
} satisfies Record<CharacterId, readonly DescriptionSection[]>;
