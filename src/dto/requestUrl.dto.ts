interface RequestUrlBody {
  url: string;
}

interface MaskedUrlData {
  target: string;
  link: string;
  valid: boolean;
  expiresIn?: any;
}
