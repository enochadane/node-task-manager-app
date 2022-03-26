import { Request, Response, NextFunction } from "express";

const validateInputs =
  (validations: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let i = 0; i < validations.length; i += 1) {
        const validation = validations[i];
        const result = await validation.run(req);
        if (result.errors.length) {
          return res.status(422).json({
            success: false,
            message: result.errors[0].msg,
          });
        }
      }
      return next();
    } catch (err) {
        return res.status(422).json({
            success: false,
            message: err.message
        })
    }
  };

  export default validateInputs;
