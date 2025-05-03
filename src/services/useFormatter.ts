export const formattIdCam = (id: number) => {
    if(id < 10){
        return '0'+ id
    } else{
        return id
    }
}

export const garantirHttps = (url: string): string => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:') {
        parsed.protocol = 'https:';
        return parsed.toString();
      }
      return url;
    } catch (err) {
      console.warn("URL inválida:", url);
      return url;
    }
  }
  