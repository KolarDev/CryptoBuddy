// Scene session interfaces
export interface BaseWizardSession extends Scenes.WizardSessionData {}

export interface ConvertSceneSession extends BaseWizardSession {
  fromCoin?: string;
  amount?: number;
  toCoin?: string;
}

export interface NewsSceneSession extends BaseWizardSession {
  selectedType: string;
  fromCoin?: string;
  amount?: number;
}

// MyContext with different session types
export interface MyContext<S extends BaseWizardSession = BaseWizardSession> extends Context {
  session: Scenes.WizardSession<S>;
  scene: Scenes.SceneContextScene<MyContext<S>, S>;
  wizard: Scenes.WizardContextWizard<MyContext<S>>;
  myContextProp: string;
}
