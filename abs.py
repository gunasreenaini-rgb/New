from abc import ABC, abstractmethod

class Hospital(ABC):
 def name(obj):
        pass

@abstractmethod
class Patient(Hospital):
    def name(obj):
        print("Gunasree")

d = Patient()
d.name()
