import { Context, Scenes } from "telegraf";

// Ensure BaseWizardSession extends Scenes.WizardSessionData
export interface BaseWizardSession extends Scenes.WizardSessionData {}

// Convert Scene session (specific to conversion logic)
export interface ConvertSceneSession extends BaseWizardSession {
  fromCoin?: string;
  amount?: number;
  toCoin?: string;
  inCoin?: string;
}

interface MySession<S extends BaseWizardSession = BaseWizardSession>
  extends Scenes.WizardSession<S> {
  globalSessionProp: string;
  data: S;
}

export interface MyContext<S extends BaseWizardSession = BaseWizardSession>
  extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;

  // declare session type
  session: MySession<S>;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext<S>, S>; // Ensure it uses S dynamically
  // declare wizard type
  wizard: Scenes.WizardContextWizard<MyContext<S>>;
}
